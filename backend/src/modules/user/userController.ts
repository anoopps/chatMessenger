import { Request, Response } from "express";
import * as userService from "./userService";

export const getUserData = async (req: Request, res: Response) => {
    try {
        // get user id from request from token        
        const userId = req.user?.userId;

        // get user data from service
        const userData = await userService.getUserData(userId!);

        // send response
        res.status(200).json({ message: "User data fetched successfully", data: { userData } });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user data", error });
    }
}

export const updateUserData = async (req: Request, res: Response) => {
    try {
        // get user id from request token
        const userId = req.user?.userId;
        console.log(userId);
        if (!req.body) {
            throw new Error("Empty request body!");
        }

        const isUpdated = await userService.updateUser(userId, req.body);

        if (isUpdated)
            res.status(200).json({ message: "User data updated successfully" });
        else
            res.status(400).json({ message: "User data updated failed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user data", error });
    }
}

export const disableUser = async (req: Request, res: Response) => {
    try {
        // get user id from request token
        // disable user from service
        // send response
    } catch (error) {
        res.status(500).json({ message: "Failed to disable user", error });
    }

}
