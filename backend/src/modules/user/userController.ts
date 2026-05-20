import { Request, Response } from "express";
import * as userService from "./userService";

export const getUserData = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user data", error });
    }
}

export const updateUserData = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Failed to update user data", error });
    }
}

export const disableUser = async (req: Request, res: Response) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Failed to disable user", error });
    }

}
