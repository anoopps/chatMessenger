import React from "react";

const MessageList = () => {
  return (
    <>
      <div className="border-bottom pb-2 mb-3">
        <h5 className="mb-0">Chat Room: chatroom_1</h5>
      </div>

      {/* Messages Area */}
      <div
        className="flex-grow-1 overflow-auto mb-3"
        style={{ maxHeight: "70vh" }}
      >
        <div className="mb-2">
          <span className="badge bg-primary">User1</span>
          <div className="p-2 bg-secondary text-light rounded mt-1">Hello!</div>
        </div>
      </div>
    </>
  );
};

export default MessageList;
