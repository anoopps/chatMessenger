/**
 * ai.controller.ts
 *
 * Responsible for: handling the HTTP layer for AI-related endpoints.
 *
 * Controller rules (keep these in mind for every controller you write):
 *   ✅ Extract data from req (params, body, user)
 *   ✅ Call the service
 *   ✅ Format and send the HTTP response
 *   ❌ No business logic
 *   ❌ No direct database calls
 *   ❌ No prompt building
 *   ❌ No Gemini SDK imports
 *
 * Request flow:
 *   POST /api/v1/chatrooms/:roomId/suggestions
 *   → authenticateToken middleware (JWT validated, req.user populated)
 *   → aiController.getSmartReplies (this file)
 *   → aiService.getSmartReplies
 *   → { success: true, data: { suggestions: [...] } }
 */

import { Request, Response } from "express";
import * as aiService from "./ai.service";

/**
 * POST /api/v1/chatrooms/:roomId/suggestions
 *
 * Returns exactly 3 AI-generated reply suggestions based on the
 * most recent messages in the specified chat room.
 *
 * Requires: valid JWT (handled by authenticateToken middleware)
 *
 * Success response (200):
 *   {
 *     "success": true,
 *     "data": {
 *       "suggestions": ["...", "...", "..."]
 *     }
 *   }
 *
 * Error responses:
 *   400 — Invalid roomId format
 *   403 — User is not a member of the room
 *   422 — No messages in the conversation yet
 *   429 — Gemini rate limit reached
 *   502 — Gemini returned an invalid response
 *   504 — Gemini request timed out
 */
export const getSmartReplies = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomId = Number(req.params.roomId);

        // req.user is typed as AuthPayload | string by the middleware declaration.
        // After authenticateToken runs successfully, it is always an AuthPayload object.
        // We narrow the type here to satisfy TypeScript — this is a type guard pattern.
        const userPayload = typeof req.user === "object" ? req.user : null;
        const userId = Number(userPayload?.userId);

        // Guard: roomId must be a valid integer.
        // If someone calls POST /chatrooms/abc/suggestions, Number("abc") = NaN.
        if (!roomId || isNaN(roomId)) {
            res.status(400).json({
                success: false,
                error: "Invalid room ID. Must be a numeric value.",
            });
            return;
        }

        // Guard: userId must exist (authenticateToken should guarantee this,
        // but we defensively check to avoid calling the service with userId = 0).
        if (!userId || isNaN(userId)) {
            res.status(401).json({
                success: false,
                error: "Unauthorized.",
            });
            return;
        }

        // Call the service — this is the only business logic call in the controller.
        const result = await aiService.getSmartReplies(userId, roomId);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        // AppError instances carry a statusCode and isOperational flag.
        // This mirrors the error handling pattern in your existing chatController.ts.
        if (error.isOperational) {
            res.status(error.statusCode).json({
                success: false,
                error: error.message,
            });
            return;
        }

        // Unexpected errors (programming bugs, unhandled edge cases) should
        // NOT expose internal details to the client. Log them server-side.
        console.error("[ai.controller] Unexpected error:", error);
        res.status(500).json({
            success: false,
            error: "An unexpected error occurred. Please try again later.",
        });
    }
};
