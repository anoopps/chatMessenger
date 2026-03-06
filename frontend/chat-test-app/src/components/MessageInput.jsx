import React from "react";

const MessageInput = () => {
  return (
    <>
      <div className="d-flex">
        <input
          type="text"
          className="form-control bg-dark text-light border-secondary me-2"
          placeholder="Type message..."
        />
        <button className="btn btn-primary">Send</button>
      </div>
    </>
  );
};

export default MessageInput;
