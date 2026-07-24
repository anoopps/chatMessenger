import React, { useState, useEffect } from "react";

/**
 * MessageInput
 *
 * Props:
 *   setSendMessage   — callback to send the final message (existing)
 *   prefillMessage   — optional string injected by Smart Reply suggestions.
 *                      When this changes, the input is pre-filled with the value.
 *   onPrefillConsumed — called after the prefill is applied, so the parent
 *                       can reset its prefillMessage state and avoid re-triggering.
 */
const MessageInput = ({ setSendMessage, prefillMessage = "", onPrefillConsumed }) => {
  const [message, setMessage] = useState("");

  // When a Smart Reply suggestion is clicked, the parent passes a non-empty
  // prefillMessage. We sync it into local state so the input is pre-filled.
  // We also focus the input so the user can start editing immediately.
  useEffect(() => {
    if (prefillMessage) {
      setMessage(prefillMessage);
      // Tell the parent we've consumed the prefill — this prevents the effect
      // from re-running on unrelated re-renders.
      if (onPrefillConsumed) onPrefillConsumed();
    }
  }, [prefillMessage]);

  const submitMessage = (e) => {
    if (!message.trim()) return;
    setSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitMessage();
    }
  };

  return (
    <>
      <div className="d-flex">
        <input
          id="message-input"
          type="text"
          className="form-control bg-dark text-light border-secondary me-2"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          required
        />
        <button className="btn btn-primary" onClick={submitMessage}>
          Send Message
        </button>
      </div>
    </>
  );
};

export default MessageInput;

