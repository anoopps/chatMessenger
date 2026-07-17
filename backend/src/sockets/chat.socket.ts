import { Server, Socket } from "socket.io";

export const getChatRoomSocketName = (chatroomId: string | number) =>
    `chatroom_${chatroomId}`;

const registerChatHandlers = (io: Server, socket: Socket) => {
    socket.on("join_room", async (chatroomId: string | number, acknowledge?: (result: { ok: boolean; roomName?: string }) => void) => {
        const roomName = getChatRoomSocketName(chatroomId);
        await socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
        acknowledge?.({ ok: true, roomName });
    });

    socket.on("leave_room", async (chatroomId: string | number) => {
        const roomName = getChatRoomSocketName(chatroomId);
        await socket.leave(roomName);
        console.log(`Socket ${socket.id} left room ${roomName}`);
    });
};

export default registerChatHandlers;
