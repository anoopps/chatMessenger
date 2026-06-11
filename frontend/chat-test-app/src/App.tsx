import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import ChatRoomList from "./components/ChatRoomList";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import Profile from "./components/Profile";
import HomeScreen from "./components/HomeScreen";
import RegisterForm from "./components/RegisterForm";
import { apiFetch } from "./utils/api.js";
import { socket } from "./utils/socket";
import UserProfile from "./components/UserProfile";
import { Routes, Route } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [selectChatroom, setSelectChatroom] = useState(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [sendMessage, setSendMessage] = useState(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    console.log(`Stored token ${localToken}`);

    const item = JSON.parse(localToken);
    const now = new Date();

    if (now.getTime() > item?.expiry) {
      localStorage.removeItem("token");
      return null;
    }

    if (item?.token) {
      setToken(item.token);
      setUser({ loggedIn: true });
    }
  }, []);

  // socket receive message
  useEffect(() => {
    const handler = (message: any) => {
      console.log("New message received:", message);
      console.log("Current room:", selectChatroom);

      // Ensure only messages for current room are added
      if (Number(message.chatroomId) === Number(selectChatroom)) {
        setMessageList((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, [selectChatroom]);

  // effect to get chatrooms based on token
  useEffect(() => {
    if (!token) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    getChatroom();

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // effect to list message based on chatroom
  useEffect(() => {
    if (!selectChatroom) return;

    alert(`Joining room: chatroom_${selectChatroom}`);

    // socket.emit("join_room", `${selectChatroom}`);
    socket.emit("join_room", selectChatroom);
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

  const sendMyMessage = async (message: any) => {
    if (!message) return;

    const tempMessage = {
      id: Date.now(), // temporary ID
      chatroomId: selectChatroom,
      senderId: user?.userId || "me",
      message,
      createdAt: new Date(),
    };

    setMessageList((prev) => [...prev, tempMessage]);

    try {
      const response = await apiFetch(
        `${API_BASE_URL}/chatrooms/${selectChatroom}/messages`,
        "POST",
        token,
        "send message",
        { message }
      );

      console.log("Server response:", response);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const sendMyMessage02 = async (message: any) => {
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
      console.log("sent message====");
      console.log(response);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
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
                {!token ? (
                  <HomeScreen />
                ) : (
                  <div className="chat-container">
                    <MessageList messageList={messageList} />
                    <MessageInput setSendMessage={setSendMessage} />
                  </div>
                )}
              </div>
              <div className="b-example-divider b-example-vr"></div>
            </main>
          </div>
        }
      />

      <Route
        path="/register"
        element={
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
                <RegisterForm />
              </div>
              <div className="b-example-divider b-example-vr"></div>
            </main>
          </div>
        }
      />

      <Route
        path="/profile"
        element={
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
                <UserProfile />
              </div>
              <div className="b-example-divider b-example-vr"></div>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
