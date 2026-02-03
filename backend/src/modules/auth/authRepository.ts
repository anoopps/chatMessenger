// authREpository
import { db } from "../../config/db";

export const createUser = async (data: any) => {

    try {
        const [result]: any = await db.query("INSERT INTO users (name, email, password) VALUES  (?, ?, ?)", [data.name, data.email, data.password]);
        console.log(result);
        return result.insertId;
    } catch (e: any) {
        return 0;
    }
}

export const isUserExist = async (email: string) => {
    try {
        const [result]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (result.length) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        // log error message
        return false;
    }
}

export const getUser = async (email: string) => {

    if (email) {
        const [user]: any = await db.query("SELECT * FROM users where email = ?", [email]);
        return user[0];
    }
    return [];
}