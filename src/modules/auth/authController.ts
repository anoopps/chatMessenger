import { Request, Response } from "express";
import * as authService from "./authService";

export const login = (req: Request, res: Response) => {


};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // need to validate the name email and password in the route request validation       
        const userObject = { name, email, password };
        const result: any = await authService.registerUser(userObject);

        if (result) {
            return res.status(201).json({
                success: true,
                message: "User Successfully Registered",
                data: {
                    result
                }
            });
        } else {
            return res.status(401).json({
                success: true,
                message: "User Registration Failed"
            });
        }

    } catch (e: any) {
        res.status(403).json({
            success: false,
            message: e.message
        });
    }
};

export const logout = (req: Request, res: Response) => {

};

