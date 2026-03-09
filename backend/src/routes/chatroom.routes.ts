import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import * as chatController from "../modules/chatRooms/chatController";

const router = Router();

router.post("/", authenticateToken, chatController.createChatRoom);
router.get("/", authenticateToken, chatController.getMyChatRooms);
router.post("/:roomId/messages", authenticateToken, chatController.sendMessage);
router.get("/:roomId/messages", authenticateToken, chatController.getMessages);


export default router;