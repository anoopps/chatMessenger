import http from "http";
import app from "./app";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();

const server = http.createServer(app);

// Attach socket.io to server
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});