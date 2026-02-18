// chat controller
import { Request, Response } from "express";
import * as chatService from "./chatService";

export const createChatRoom = async (req: Request, res: Response) => {
    try {

        // chatService        
        const isGroup = Boolean(req.body.isGroup);
        const chatRoomName = req.body.name ?? null;
        const user = req.user?.userId;

        let memberIds: Array<number> = [];
        const memberId = req.body.memberId ?? null;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (memberId) {
            memberIds = memberIds.concat(memberId);
        }

        const validatedMemberIds = memberIds.map(id => Number(id)).filter(id => !isNaN(id));

        let dataObj = {
            isGroup,
            chatRoomName,
            memberIds: validatedMemberIds,
            user
        };

        const result = await chatService.createChatRoom(dataObj);
        res.status(201).json({
            success: true,
            message: "Chatroom Successfully Created",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
};

// get loggedIn user chatroom 
export const getMyChatRooms = async (req: Request, res: Response) => {

    try {

        const user = req.user?.userId;
        const data = await chatService.getChatrooms(user);

        return res.status(200).json({
            success: true,
            data
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const sendMessage = async (req: Request, res: Response) => {

    try {
        console.log(req.body);
        const chatRoomId = req.params.roomId;
        const userId = req.user?.userId;
        const { message } = req.body;

        const data = await chatService.validateAndSendMessage(userId, chatRoomId, message);
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data
        });
    } catch (error: any) {

        if (error.isOperational) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message
            });
        }
    }
};
