import { Server, Socket } from "socket.io";

const registerChatHandlers = (io: Server, socket: Socket) => {
    socket.on("join_room", (chatroomId: string) => {
        socket.join(chatroomId);
        console.log(`Socket ${socket.id} joined room ${chatroomId}`);
    });

    socket.on("leave_room", (chatroomId: string) => {
        socket.leave(chatroomId);
        console.log(`Socket ${socket.id} left room ${chatroomId}`);
    });
};

export default registerChatHandlers;
