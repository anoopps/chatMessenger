// chat controller
import { Request, Response } from "express";
import * as chatService from "./chatService";

export const createChatRoom = async (req: Request, res: Response) => {
    try {

        // chatService        
        const isGroup = req.body.isGroup;
        const chatRoomName = req.body.name ?? null;
        const memberId = req.body.memberId ?? null;
        const memberIds = req.body.memberIds ?? null;
        const user = req.user;
        // console.log(user);

        let dataObj;

        if (!isGroup) {
            dataObj = {
                isGroup,
                memberId,
                user
            };
        } else {
            dataObj = {
                isGroup,
                memberIds,
                user
            };
        }

        const result = await chatService.createChatRoom(dataObj);

        res.status(201).json({
            success: true,
            message: "Chatroom Successfully Created",
            result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message
        });
    }
};

export const getMyChatRooms = async (req: Request, res: Response) => {

};

export const sendMessage = async (req: Request, res: Response) => {

};
