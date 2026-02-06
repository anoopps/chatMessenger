// chatService
import * as chatRepository from "./chatRepository";

export const createChatRoom = async (chatRoomObj: any) => {

    try {
        let userId = chatRoomObj.user;
        let chatRoomName = chatRoomObj.name ?? null;
        let response = {};

        // create members for chatroom based on isGroup if isGroup is false it will have 2 distinct member ids, other wise an array of members
        let chatRoomMembers = [];
        if (!chatRoomObj.isGroup) {
            // cross check member and user login id
            if (!chatRoomObj.memberId || chatRoomObj.memberId === userId) {
                throw new Error("Invalid Member id");
            }
            chatRoomMembers.push(chatRoomObj.memberId);
            chatRoomMembers.push(chatRoomObj.user);
        } else if (chatRoomObj.isGroup) {
            chatRoomMembers.push(...chatRoomObj.memberIds);
            chatRoomMembers.push(userId);
        }

        // fetch and also validate member id from user login table
        const participants = await chatRepository.getMembers(chatRoomMembers);
        if (participants.length == 0) {
            throw new Error("Invalid members");
        }

        const dataObj = {
            is_group: chatRoomObj.isGroup,
            name: chatRoomName,
            created_by: userId
        };

        const result = await chatRepository.create(dataObj);
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
        return response;
    } catch (e: any) {

    }
}