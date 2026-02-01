// authService
import * as authRepository from "./authRepository";
import bcrypt from "bcryptjs";

export const registerUser = async (userObject: any) => {

    // validate user id exists or not
    const isUserExist = await authRepository.isUserExist(userObject.email);

    if (isUserExist) {
        return 0;
    }

    const hashPassword: string = await bcrypt.hash(userObject.password, 10); // saltRounds 10–12 recommended

    const user = {
        name: userObject.name,
        email: userObject.email,
        password: hashPassword
    };

    return await authRepository.createUser(user);
};

