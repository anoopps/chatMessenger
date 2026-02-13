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
        let chatRoomMembers = [userId];
        let isChatRoom = {
            isExists: false,
            chatRoomId: 0
        };;

        // 1. Initialize and ensure the current user is always included
        if (!chatRoomObj.isGroup) {
            // Validation for 1-on-1 chats
            const targetMemberId = chatRoomObj.memberIds[0];

            // Check if memberId exists AND isn't the current user
            if (!targetMemberId || targetMemberId === userId) {
                throw new Error("Invalid Member ID: You cannot start a 1-on-1 chat with yourself");
            }

            chatRoomMembers.push(targetMemberId);

            // Verify if a private chatroom already exists between these two
            isChatRoom = await chatRepository.isChatRoomExists(chatRoomMembers);

        } else {
            // Validation for Group chats
            if (Array.isArray(chatRoomObj.memberIds) && chatRoomObj.memberIds.length > 0) {
                // Merge IDs and remove any accidental duplicates (like if userId was also in memberIds)
                chatRoomMembers = [...new Set([...chatRoomObj.memberIds, userId])];
            } else {
                throw new Error("Group chats must have at least one other member.");
            }
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
        console.log(e);
        throw new Error(e.message);
    }
};

// export const 
export const getChatrooms = async (userId: number) => {

    // Find all chat_room_ids where user is a member
    const chatRoomIds: number[] = await chatRepository.getChatRoomIds(userId);
    let response = [];

    if (!chatRoomIds.length) return [];

    // Fetch chatroom details 
    if (chatRoomIds.length && Array.isArray(chatRoomIds)) {
        const chatRoomDetails = await chatRepository.chatRoomDetails(chatRoomIds);

        // Single query for all participants
        const allParticipants = await chatRepository.getChatParticipants(chatRoomIds);

        const participantsMap = new Map<number, Participant[]>();
        console.log(allParticipants);

        for (const participant of allParticipants) {

            const roomId = participant.chat_room_id;

            if (!participantsMap.has(roomId)) {
                participantsMap.set(roomId, []);
            }

            participantsMap.get(roomId)?.push({
                userId: participant.userId,
                name: participant.name,
                email: participant.email
            });
        }

        console.log(participantsMap);


        // Fetch participants for each chatroom
        for (const rooms of chatRoomDetails) {
            let chatRoomObj = {
                "id": rooms.id,
                "name": rooms.name,
                "isGroup": rooms.is_group,
                "participants": participantsMap.get(rooms.id) || []
            };
            response.push(chatRoomObj);
        }
    }
    return response;
};