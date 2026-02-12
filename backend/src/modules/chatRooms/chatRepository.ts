// chat Repository
import { db } from "../../config/db";
export interface Member {
    userId: number;
    name: string;
};

interface Participant {
    userId: number;
    name: string;
    email: string;
};

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

    return rows as Member[];
};

export const isChatRoomExists = async (members: number[]) => {

    let chatExistObj = {};

    const [rows]: any = await db.query(`SELECT crm.chat_room_id 
        FROM chat_room_members AS crm
        INNER JOIN chat_rooms AS cr ON cr.id = crm.chat_room_id AND cr.is_group = 0
        WHERE crm.user_id IN (?) 
        GROUP BY crm.chat_room_id 
        HAVING COUNT(DISTINCT crm.user_id) = 2 AND COUNT(*) = 2
        `, [members]);

    if (rows.length) {
        return {
            isExists: true,
            chatRoomId: rows[0].chat_room_id
        }
    }
    return {
        isExists: false,
        chatRoomId: 0
    };
};

export const getChatRoomIds = async (userId: number): Promise<number[]> => {

    if (!userId) return [];

    const [resultChatRoomIds] = await db.query("SELECT chat_room_id FROM chat_room_members WHERE user_id = ?", [userId]);

    const chatRoomIds: number[] = (resultChatRoomIds as any[]).map(
        row => row.chat_room_id
    );
    return chatRoomIds;
};

export const chatRoomDetails = async (chatRoomIds: Array<number>) => {

    const [result] = await db.query("SELECT * FROM chat_rooms where id IN(?) ORDER BY created_at DESC", [chatRoomIds]);
    return result;
};



export const getChatParticipants = async (roomId: number): Promise<Participant[]> => {
    const [rows] = await db.query(
        `SELECT u.id AS userId, u.name, u.email
     FROM chat_room_members crm
     JOIN users u ON u.id = crm.user_id
     WHERE crm.chat_room_id = ?`,
        [roomId]
    );

    return rows as Participant[]; // IMPORTANT
};