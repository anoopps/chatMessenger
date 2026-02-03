// authService
import * as authRepository from "./authRepository";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (userObject: any) => {

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


export const userLogin = async (userObject: any) => {

    // validate user id exists or not
    const user = await authRepository.getUser(userObject.email);
    if (!user) throw new Error("Invalid Login");

    if (!user.password || !userObject.password) {
        throw new Error("Password not found");
    }
    const isMatch = await bcrypt.compare(userObject.password, user.password);
    if (!isMatch) {
        throw new Error("Password mismatch");
    }

    const jwtSecretKey = process.env.JWT_SECRET || "mysecret123";

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecretKey as string,
        { expiresIn: "24h" }
    );
    console.log("token");
    console.log(token);
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};