import * as userRepository from "./userRepository";
import { userData } from "./user.types";

export const getUserData = async (id: number) => {
    if (id)
        return userRepository.getUserById(id);
    else
        throw new Error("User id is required");

}

export const updateUser = async (id: number, userData: userData) => {
    if (!id) {
        throw new Error("User id is required");
    }
    if (!userData) {
        throw new Error("User data is required");
    }
    return userRepository.updateUser(id, userData);
}