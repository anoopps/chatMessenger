import React, { useState } from "react";

const MessageInput = ({ setSendMessage }) => {
  const [message, setMessage] = useState("");

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
          type="text"
          className="form-control bg-dark text-light border-secondary me-2"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={submitMessage}>
          Send
        </button>
      </div>
    </>
  );
};

export default MessageInput;
