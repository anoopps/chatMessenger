import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import * as chatController from "../modules/chatRooms/chatController";

const router = Router();

router.post("/", authenticateToken, chatController.createChatRoom);
// router.get("/", authenticateToken, getMyChatRooms);
// router.post("/:roomId/messages", authenticateToken, sendMessage);


export default router;