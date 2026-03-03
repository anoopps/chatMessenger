import React from "react";

const ChatRoomList = () => {
  return (
    <div>
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
      >
        <svg
          className="bi pe-none me-2"
          width="40"
          height="32"
          aria-hidden="true"
        >
          <use xlinkHref="#bootstrap"></use>
        </svg>
        <span className="fs-4">ChatRooms</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="#" className="nav-link active">
            chatroom_1
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            chatroom_2
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ChatRoomList;
