import React from "react";

const MessageList = ({ messageList, chatRoomName }) => {
  console.log("single message => ", messageList);

  return (
    <>
      <div className="border-bottom pb-2 mb-3">
        <h5 className="mb-0">Chat Room: {chatRoomName}</h5>
      </div>

      {/* Messages Area */}
      <div className="flex-grow-1 overflow-auto mb-3">
        {messageList.length === 0 ? (
          <div className="text-center text-muted mt-4">
            You have no messages
          </div>
        ) : (
          messageList.map((message, key) => (
            <div className="mb-2" key={key}>
              <span className="badge bg-primary">
                {message.user?.name || "Unknown User"}
              </span>
              <div className="p-2 bg-secondary text-light rounded mt-1">
                {message.message}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MessageList;
