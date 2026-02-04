import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthPayload } from "../utils/auth";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload | string
        }
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader?.split(" ")[1];

        if (!token?.trim()) {
            throw new Error("Invalid Authorization Token");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not configured");
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;
        req.user = decodedUser;

        next();
    } catch (err: any) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Authentication failed' });
    }
};

export default authenticateToken;