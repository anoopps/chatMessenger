import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import * as chatController from "../modules/chatRooms/chatController";
import * as aiController from "../modules/ai/ai.controller";

const router = Router();

// ── Chatroom routes ──────────────────────────────────────────────────────────
router.post("/", authenticateToken, chatController.createChatRoom);
router.get("/", authenticateToken, chatController.getMyChatRooms);

// ── Message routes ───────────────────────────────────────────────────────────
router.post("/:roomId/messages", authenticateToken, chatController.sendMessage);
router.get("/:roomId/messages", authenticateToken, chatController.getMessages);

// ── AI Smart Reply route ─────────────────────────────────────────────────────
// POST /api/v1/chatrooms/:roomId/suggestions
// Protected by authenticateToken — callers must have a valid JWT.
// Returns exactly 3 AI-generated reply suggestions for the given room.
router.post("/:roomId/suggestions", authenticateToken, aiController.getSmartReplies);

export default router;