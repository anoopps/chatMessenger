/**
 * smartReply.prompt.ts
 *
 * Responsible for: building the prompt string sent to the LLM.
 *
 * Design principle:
 *   This is a pure function. It has no side effects, no imports from the
 *   database layer or HTTP layer. It takes data → returns a string.
 *   This makes it independently testable and easy to tune without touching
 *   any service or controller code.
 */

export interface PromptMessage {
    senderName: string;
    message: string;
}

/**
 * Builds the Smart Reply prompt from the most recent messages in a conversation.
 *
 * @param messages - Array of recent messages ordered oldest → newest.
 *                   Limit to the last 10 before calling this function.
 * @returns         A fully-formed prompt string ready to be sent to the LLM.
 */
export const buildSmartReplyPrompt = (messages: PromptMessage[]): string => {
    // Format the conversation as a readable transcript.
    // "Alice: Hey, are you free tomorrow?" is more natural for the LLM
    // than a JSON representation — it mirrors real chat transcripts.
    const conversationTranscript = messages
        .map((msg) => `${msg.senderName}: ${msg.message}`)
        .join("\n");

    return `You are a smart reply assistant for a chat application.

Your task is to read the following conversation and suggest exactly 3 short, natural reply options that the LAST person in the conversation might send next.

CONVERSATION:
${conversationTranscript}

RULES (follow every rule strictly):
1. Generate EXACTLY 3 reply suggestions. Never more, never fewer.
2. Each reply must be under 20 words.
3. Each reply must be relevant to the conversation context above.
4. Do NOT include numbering, bullet points, or labels in the replies.
5. Do NOT add any explanation, commentary, or extra text outside the JSON.
6. Do NOT include markdown formatting or code fences in your response.
7. Replies should sound like a real human typed them — natural and conversational.
8. Vary the tone: one reply should be affirmative, one should be a question or alternative, and one should be cautious or neutral.

RESPONSE FORMAT (return ONLY this JSON object, nothing else):
{
  "suggestions": [
    "First reply here",
    "Second reply here",
    "Third reply here"
  ]
}`;
};
