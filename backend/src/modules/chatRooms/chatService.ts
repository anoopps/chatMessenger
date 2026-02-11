// chatService
import { promises } from "node:dns";
import * as chatRepository from "./chatRepository";

export interface Participant {
    userId: number;
    name: string;
    email: string;
};

export interface ChatResponse {
    id: number;
    name: string;
    isGroup: boolean;
    participants: Participant[];
};

export const createChatRoom = async (chatRoomObj: any) => {

    try {
        let userId = chatRoomObj.user;
        let chatRoomName = chatRoomObj.chatRoomName ?? null;
        let response = {};
        let chatRoomMembers = [];
        let isChatRoom = {
            isExists: false,
            chatRoomId: 0
        };;

        // 1. Collect all potential IDs
        if (!chatRoomObj.isGroup) {
            // cross check member and user login id
            if (!chatRoomObj.memberId || chatRoomObj.memberId === userId) {
                throw new Error("Invalid Member id");
            }
            chatRoomMembers.push(chatRoomObj.memberId, userId);

            // verify the chatroom already exists  
            isChatRoom = await chatRepository.isChatRoomExists(chatRoomMembers);
        } else if (chatRoomObj.isGroup) {
            chatRoomMembers.push(...chatRoomObj.memberIds, userId);
        }

        // 2. Clean the list
        chatRoomMembers = [...new Set(chatRoomMembers)];

        // fetch and also validate member id from user login table
        const participants = await chatRepository.getMembers(chatRoomMembers);

        if (participants.length !== chatRoomMembers.length) {
            throw new Error("One or more members are invalid");
        }

        const dataObj = {
            is_group: chatRoomObj.isGroup,
            name: chatRoomName,
            created_by: userId
        };

        let result;
        if (!isChatRoom.isExists) {
            result = await chatRepository.create(dataObj);
            if (!result.insertId) {
                throw new Error("Chatroom creation failed");
            }
            const chatRoomId = result.insertId;
            await chatRepository.createMembers(chatRoomId, chatRoomMembers);
            response = {
                "chatroom": {
                    id: chatRoomId,
                    ...dataObj
                },
                "participants": [
                    ...participants
                ]
            }
        } else {
            response = {
                "chatroom": {
                    id: isChatRoom.chatRoomId,
                    is_group: false
                },
                message: "Chatroom already exists"
            }
        }

        return response;
    } catch (e: any) {
        throw new Error(e.message);
    }
};

// export const 
export const getChatrooms = async (userId: number): Promise<ChatResponse> => {

    // Find all chat_room_ids where user is a member
    const chatRoomIds = await chatRepository.getChatRoomIds(userId);
    let response = [];

    // Fetch chatroom details 
    if (chatRoomIds.length && Array.isArray(chatRoomIds)) {
        const chatRoomDetails = await chatRepository.chatRoomDetails(chatRoomIds);
        // console.log(chatRoomDetails);

        // Fetch participants for each chatroom
        for (const rooms of chatRoomDetails) {
            const participants = await chatRepository.getChatParticipants(rooms.id);
            let chatRoomObj = {
                "id": rooms.id,
                "name": rooms.name,
                "isGroup": rooms.is_group,
                "participants": participants
            };
            response.push(chatRoomObj);
        }
    }
    return response;
};