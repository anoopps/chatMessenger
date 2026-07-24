/**
 * ai.service.ts
 *
 * Responsible for: orchestrating the Smart Reply business logic.
 *
 * This service is intentionally isolated from the chat service.
 * It knows about AI, messages, and authorization.
 * It does NOT know about HTTP (no req/res), sockets, or React state.
 *
 * Request flow through this file:
 *   1. Validate the user is a member of the chatroom (security guard)
 *   2. Load the last 10 messages from the database
 *   3. Handle the empty conversation edge case
 *   4. Build the prompt
 *   5. Call Gemini with a timeout
 *   6. Parse and validate the JSON response
 *   7. Return exactly 3 suggestions
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as chatRepository from "../chatRooms/chatRepository";
import * as chatService from "../chatRooms/chatService";
import {
    buildSmartReplyPrompt,
    PromptMessage,
} from "./smartReply.prompt";
import { AppError } from "../../utils/AppError";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GEMINI_MODEL = "gemini-3.5-flash"; // Fast, cheap, excellent for short text
const MAX_MESSAGES_FOR_CONTEXT = 10;     // Balance between context quality and token cost
const REQUEST_TIMEOUT_MS = 15_000;       // 15 seconds — generous for 3 short suggestions

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SmartReplyResult {
    suggestions: string[];
}

// ---------------------------------------------------------------------------
// Gemini client factory
//
// We initialize the client lazily (inside the function) rather than at
// module load time. Why? At module load, dotenv may not have run yet in
// certain test or import scenarios. Lazy initialization also makes it easy
// to mock in unit tests by mocking the module.
// ---------------------------------------------------------------------------

const getGeminiClient = (): GoogleGenerativeAI => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
        throw new AppError(
            "GEMINI_API_KEY is not configured. Set it in your .env file.",
            500
        );
    }

    return new GoogleGenerativeAI(apiKey);
};

// ---------------------------------------------------------------------------
// Main service function
// ---------------------------------------------------------------------------

/**
 * Generates 3 smart reply suggestions for a given chat room.
 *
 * @param userId   - ID of the requesting user (for authorization)
 * @param roomId   - ID of the target chat room
 * @returns        - Object containing exactly 3 suggestion strings
 * @throws AppError on authorization failure, empty conversation, API errors,
 *                  invalid response format, or timeout.
 */
export const getSmartReplies = async (
    userId: number,
    roomId: number
): Promise<SmartReplyResult> => {

    // ------------------------------------------------------------------
    // 1. Authorization guard
    //
    // Why here and not just in the controller middleware?
    // Defense in depth. The middleware confirms the JWT is valid.
    // This check confirms the authenticated user actually belongs to THIS
    // specific room. A valid JWT holder could otherwise read suggestions
    // for rooms they don't participate in.
    // ------------------------------------------------------------------
    const isMember = await chatService.isChatRoomParticipant(userId, roomId);
    if (!isMember) {
        throw new AppError(
            "Access denied: you are not a member of this chat room.",
            403
        );
    }

    // ------------------------------------------------------------------
    // 2. Load recent messages
    //
    // We reuse the existing chatRepository function. We add LIMIT 10
    // directly in a dedicated repository function to keep the query lean.
    // The existing getChatRoomMessages returns all messages — we slice
    // the result here to avoid adding another DB function for now.
    // ------------------------------------------------------------------
    const rawMessages = await chatRepository.getChatRoomMessages(roomId);
    const recentMessages = rawMessages.slice(-MAX_MESSAGES_FOR_CONTEXT);

    // ------------------------------------------------------------------
    // 3. Handle empty conversation
    //
    // We cannot generate contextual replies if there are no messages.
    // Return a 422 (Unprocessable Entity) — the request was valid but
    // the server cannot produce a meaningful result with this data.
    // ------------------------------------------------------------------
    if (recentMessages.length === 0) {
        throw new AppError(
            "Cannot generate suggestions: this conversation has no messages yet.",
            422
        );
    }

    // ------------------------------------------------------------------
    // 4. Build the prompt
    //
    // Map raw DB rows to PromptMessage shape. The DB query returns
    // { message, name, userId, ... } — see chatRepository.getChatRoomMessages.
    // ------------------------------------------------------------------
    const promptMessages: PromptMessage[] = recentMessages.map((row: any) => ({
        senderName: row.name || "Unknown",
        message: row.message,
    }));

    const prompt = buildSmartReplyPrompt(promptMessages);

    // ------------------------------------------------------------------
    // 5. Call Gemini with timeout
    //
    // We wrap the SDK call in Promise.race against a timeout.
    // If Gemini does not respond in 15 seconds, we reject with a 504
    // (Gateway Timeout) — the upstream service is the problem, not ours.
    // ------------------------------------------------------------------
    const gemini = getGeminiClient();
    const model = gemini.getGenerativeModel({ model: GEMINI_MODEL });

    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
            () =>
                reject(
                    new AppError(
                        "AI service timed out. Please try again.",
                        504
                    )
                ),
            REQUEST_TIMEOUT_MS
        )
    );

    let rawText: string;

    try {
        const geminiCall = model.generateContent(prompt);
        const result = await Promise.race([geminiCall, timeoutPromise]);
        rawText = result.response.text();
    } catch (err: any) {
        // Re-throw our own AppErrors (timeout) unchanged.
        if (err instanceof AppError) throw err;

        // Handle Gemini API-level errors (rate limits, quota exceeded, etc.)
        // Gemini throws plain errors with descriptive messages.
        const isRateLimit =
            err.message?.includes("429") ||
            err.message?.toLowerCase().includes("quota") ||
            err.message?.toLowerCase().includes("rate limit");

        if (isRateLimit) {
            throw new AppError(
                "AI service rate limit reached. Please wait a moment and try again.",
                429
            );
        }

        throw new AppError(
            `AI service error: ${err.message ?? "Unknown error"}`,
            502
        );
    }

    // ------------------------------------------------------------------
    // 6. Parse the JSON response
    //
    // Despite our prompt instructions, Gemini sometimes wraps its JSON
    // in markdown code fences (```json ... ```). We extract the JSON
    // object defensively using a regex, then parse it.
    // ------------------------------------------------------------------
    let suggestions: string[];

    try {
        // Extract the first {...} block from the response text.
        // This handles cases where Gemini adds surrounding text.
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON object found in response");
        }

        const parsed = JSON.parse(jsonMatch[0]);

        if (!Array.isArray(parsed.suggestions)) {
            throw new Error("Response missing 'suggestions' array");
        }

        suggestions = parsed.suggestions;
    } catch (parseError: any) {
        // This is a 502: the upstream AI service returned an invalid format.
        throw new AppError(
            `AI returned an invalid response format: ${parseError.message}`,
            502
        );
    }

    // ------------------------------------------------------------------
    // 7. Validate exactly 3 suggestions
    //
    // The model may occasionally return 2 or 4 items despite the prompt.
    // We enforce the contract strictly. The frontend always expects exactly
    // 3 — don't silently pass bad data downstream.
    // ------------------------------------------------------------------
    if (suggestions.length !== 3) {
        throw new AppError(
            `AI returned ${suggestions.length} suggestions instead of 3. Please retry.`,
            502
        );
    }

    // Trim whitespace from each suggestion as a final hygiene step.
    const cleanedSuggestions = suggestions.map((s) => String(s).trim());

    return { suggestions: cleanedSuggestions };
};
