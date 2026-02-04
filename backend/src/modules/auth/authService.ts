// authService
import * as authRepository from "./authRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RegisterInput, LoginInput, AuthResponse } from "./auth.types";
import bcrypt from "bcryptjs";

export const registerUser = async (userObject: RegisterInput): Promise<number> => {

    // validate user id exists or not
    const isUserExist = await authRepository.isUserExist(userObject.email);

    if (isUserExist) {
        throw new Error("Email already registered");
    }

    const hashPassword: string = await bcrypt.hash(userObject.password, 10); // saltRounds 10–12 recommended

    return await authRepository.createUser({
        name: userObject.name,
        email: userObject.email,
        password: hashPassword
    });
};


export const userLogin = async (userObject: LoginInput): Promise<AuthResponse> => {

    // validate user id exists or not
    const user = await authRepository.getUser(userObject.email);
    if (!user || !user.password) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(userObject.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not configured");
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "24h" }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};