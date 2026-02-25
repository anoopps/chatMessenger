import http from "http";
import app from "./app";
import dotenv from "dotenv";
import { initSocket } from "./sockets"; // 👈 better structure

dotenv.config();

const server = http.createServer(app);

// Initialize socket from separate folder
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
