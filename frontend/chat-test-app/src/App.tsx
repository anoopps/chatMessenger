import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import ChatRoomList from "./components/ChatRoomList";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import Profile from "./components/Profile";
import { apiFetch } from "./utils/api.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [selectChatroom, setSelectChatroom] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setUser({ loggedIn: true });
    }
  }, []);

  // effect to get chatrooms based on token
  useEffect(() => {
    if (!token) return;
    getChatroom();
  }, [token]);

  // effect to list message based on chatroom
  useEffect(() => {
    if (!selectChatroom) return;
    getMessageList(selectChatroom);
  }, [selectChatroom]);

  // effect to send message
  useEffect(() => {
    if (!sendMessage) return;
    sendMyMessage(sendMessage);
  }, [sendMessage]);

  const getChatroom = async () => {
    if (!token) return;
    const rooms = await apiFetch(
      `${API_BASE_URL}/chatrooms`,
      "GET",
      token,
      "chatrooms"
    );
    setChatrooms(rooms.data);
  };

  const getMessageList = async (roomId) => {
    if (roomId) {
      let response = await apiFetch(
        `${API_BASE_URL}/chatrooms/${roomId}/messages`,
        "GET",
        token,
        "message"
      );
      setMessageList(response.data);
    }
  };

  const sendMyMessage = async (message) => {
    if (message) {
      console.log(selectChatroom);
      console.log(message);

      const response = await apiFetch(
        `${API_BASE_URL}/chatrooms/${selectChatroom}/messages`,
        "POST",
        token,
        "send message",
        {
          message,
        }
      );

      console.log(response);
      getMessageList(selectChatroom);
    }
  };

  return (
    <div data-bs-theme="dark">
      <main className="d-flex flex-nowrap">
        {/* Sidebar Section */}
        <div
          className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
          style={{ width: "20%" }}
        >
          {/* Login Form  */}
          {!token ? (
            <LoginForm setUser={setUser} setToken={setToken} />
          ) : (
            <Profile user={user} setUser={setUser} setToken={setToken} />
          )}

          {/* Chat room list  */}
          {token && (
            <ChatRoomList
              chatrooms={chatrooms}
              setSelectChatroom={setSelectChatroom}
              token={token}
            />
          )}
        </div>

        {/* Content Section */}
        <div className="d-flex flex-column flex-fill p-3 bg-dark text-light">
          {/* Chat Header */}
          <MessageList messageList={messageList} />
          {/* Input Area */}
          <MessageInput setSendMessage={setSendMessage} />
        </div>
        <div className="b-example-divider b-example-vr"></div>
      </main>
    </div>
  );
}

export default App;
