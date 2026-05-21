// authREpository
import { db } from "../../config/db";
import { userData } from "./user.types";

export const getUserById = async (id: number): Promise<userData | null> => {
    const [rows]: any = await db.query("SELECT name, email, is_active FROM users where id = ?", [id]);
    if (rows.length) {
        return rows[0] as userData;
    } else {
        return null;
    }
}

export const updateUser = async (id: number, userData: any) => {

    const conditions: string[] = [];
    const values: any[] = [];

    Object.entries(userData).forEach(([key, value]) => {
        conditions.push(`${key} = ?`);
        values.push(value);
    });
    values.push(id);

    const queryString = `UPDATE users SET ${conditions.join(", ")} WHERE id = ?`;
    const [result]: any = await db.query(queryString, values);

    if (result.affectedRows) {
        return true;
    } else {
        return false;
    }
}