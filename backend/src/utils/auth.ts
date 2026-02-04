import { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
    userId: number,
    email: string
}