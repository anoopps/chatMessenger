import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SOCKET_SERVER_URL = new URL(API_BASE_URL, window.location.origin).origin;

// API_BASE_URL includes /api/v1 for REST. Socket.IO must connect to the
// server origin, otherwise /api/v1 is treated as a Socket.IO namespace.
export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});
