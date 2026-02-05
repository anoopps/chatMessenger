// chatService
import * as chatRepository from "./chatRepository";

export const createChatRoom = async (chatRoomObj: any) => {

    try {
        let userId = chatRoomObj.user.userId;
        let chatRoomName = chatRoomObj.name ?? null;

        // validate member id 
        if (!chatRoomObj.memberId) {
            throw new Error("Invalid Member id");
        }

        // cross check member and user login id
        if (chatRoomObj.memberId == userId) {
            throw new Error("Invalid Member id");
        }

        const dataObj = {
            name: chatRoomName,
            is_group: chatRoomObj.isGroup,
            created_by: userId
        };

        const result = await chatRepository.create(dataObj);
        return result;
    } catch (e: any) {

    }
}