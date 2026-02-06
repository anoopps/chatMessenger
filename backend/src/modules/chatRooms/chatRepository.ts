// chat Repository
import { db } from "../../config/db";
export interface Member {
    userId: number;
    name: string;
}


export const create = async (dataObj: any) => {

    const [result]: any = await db.query("INSERT INTO chat_rooms ( name, is_group, created_by ) VALUES ( ?,?,? )",
        [dataObj.name,
        dataObj.is_group,
        dataObj.created_by
        ]);
    return result;
}

export const createMembers = async (chatRoomId: number, chatRoomMembers: Array<number>) => {
    try {
        if (chatRoomMembers.length && Array.isArray(chatRoomMembers)) {
            for (let member of chatRoomMembers) {
                await db.query("INSERT INTO chat_room_members (chat_room_id, user_id) VALUES (?,?)", [chatRoomId, member])
            }
        }
        return true;
    } catch (e: any) {
        return false;
    }
}

export const getMembers = async (members: number[]): Promise<Member[]> => {
    if (!members.length) return [];

    const [rows] = await db.query(
        `SELECT id AS userId, name 
     FROM users 
     WHERE id IN (?)`,
        [members]
    );

    return rows;
};