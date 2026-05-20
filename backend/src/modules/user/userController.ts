import { Request, Response } from "express";
import * as userService from "./userService";

export const getUserData = async (req: Request, res: Response) => {
    try {
        // get user id from request from token
        // get user data from service 
        // send response

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user data", error });
    }
}

export const updateUserData = async (req: Request, res: Response) => {
    try {
        // get user id from request token
        // get and update user data from service
        // update the user data user service 
        // send response
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
