import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import registerChatHandlers from "./chat.socket";

let io: Server;

/**
 * Initialize socket server
 */
export const initSocket = (server: HTTPServer): Server => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.use((socket: Socket, next) => {
        try {
            // const token = socket.handshake.auth?.token;
            // TODO: verify JWT here later
            next();
        } catch (error) {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket: Socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Register chat events
        registerChatHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
};

/**
 * Access socket instance anywhere (like controllers)
 */
export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
