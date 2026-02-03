import { Request, Response } from "express";
import * as authService from "./authService";

export const login = async (req: Request, res: Response) => {

    try {
        const result = await authService.userLogin(req.body);
        console.log(result);

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid user login"
            });
        }
        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error
        });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // need to validate the name email and password in the route request validation       
        const userObject = { name, email, password };
        const userId: any = await authService.registerUser(userObject);

        if (userId) {
            return res.status(201).json({
                success: true,
                message: "User Successfully Registered",
                data: {
                    userId: userId
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Email already registered"
            });
        }

    } catch (e: any) {
        res.status(409).json({
            success: false,
            message: e.message || "Registration failed"
        });
    }
};

export const logout = (req: Request, res: Response) => {

};

