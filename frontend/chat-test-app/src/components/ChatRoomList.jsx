import React from "react";

const ChatRoomList = ({ chatrooms, setSelectChatroom }) => {
  console.log("Inside Chatroom ");
  console.log(chatrooms);
  const setMyChatRoom = (e, roomId) => {
    e.preventDefault();
    console.log("my selected room");
    console.log(roomId);

    setSelectChatroom(roomId);
  };

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
        {chatrooms &&
          chatrooms.map((room) => {
            return (
              <li className="nav-item" key={room.id}>
                <a
                  href="#"
                  className="nav-link"
                  onClick={(e) => setMyChatRoom(e, room.id)}
                >
                  {room.name}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ChatRoomList;
