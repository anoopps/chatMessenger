import { useEffect, useRef, useState } from "react";
import LoginForm from "./components/LoginForm";
import ChatRoomList from "./components/ChatRoomList";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import SmartReplySuggestions from "./components/SmartReplySuggestions";
import Profile from "./components/Profile";
import HomeScreen from "./components/HomeScreen";
import RegisterForm from "./components/RegisterForm";
import { apiFetch } from "./utils/api.js";
import { socket } from "./utils/socket";
import UserProfile from "./components/UserProfile";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [selectChatroom, setSelectChatroom] = useState(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const selectedChatroomRef = useRef<number | null>(null);

  // prefillMessage: set by SmartReplySuggestions when the user clicks a chip.
  // Consumed by MessageInput via a useEffect inside that component.
  // Reset to "" after MessageInput signals it has applied the value.
  const [prefillMessage, setPrefillMessage] = useState("");

  // Called when a suggestion chip is clicked.
  const handleSuggestionSelect = (text: string) => {
    setPrefillMessage(text);
  };

  // Called by MessageInput after it has applied the prefill, so we don't
  // re-trigger the effect on subsequent re-renders.
  const handlePrefillConsumed = () => {
    setPrefillMessage("");
  };

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

  // Register this once. The ref always contains the currently selected room.
  useEffect(() => {
    const handler = (message: any) => {
      console.log("New message received:", message);
      console.log("Current room:", selectedChatroomRef.current);

      if (Number(message.chatroomId) === Number(selectedChatroomRef.current)) {
        setMessageList((prev) =>
          prev.some((existing) => existing.id === message.id)
            ? prev
            : [...prev, message]
        );
      }
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);

  // effect to get chatrooms based on token
  useEffect(() => {
    if (!token) return;

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      const activeRoom = selectedChatroomRef.current;
      if (activeRoom) {
        socket.emit("join_room", activeRoom);
      }
    };

    socket.on("connect", handleConnect);
    socket.connect();
    getChatroom();

    return () => {
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [token]);

  // effect to list message based on chatroom
  useEffect(() => {
    if (!selectChatroom) return;

    const previousRoom = selectedChatroomRef.current;
    if (previousRoom && Number(previousRoom) !== Number(selectChatroom)) {
      socket.emit("leave_room", previousRoom);
    }

    selectedChatroomRef.current = Number(selectChatroom);
    setMessageList([]);
    console.log(` Joined the room > ${selectChatroom}`);

    const joinRoom = () => socket.emit("join_room", selectChatroom);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    // REST history must remain available even while Socket.IO is reconnecting.
    getMessageList(selectChatroom);

    return () => {
      socket.off("connect", joinRoom);
    };
  }, [selectChatroom]);

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
      if (Number(roomId) !== Number(selectedChatroomRef.current)) return;

      setMessageList((previous) => {
        const messagesById = new Map();
        [...response.data, ...previous].forEach((message) => {
          messagesById.set(message.id, message);
        });
        return Array.from(messagesById.values());
      });
    }
  };

  const sendMyMessage = async (message: any) => {
    if (!message) return;

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
          <MainLayout
            token={token}
            user={user}
            setUser={setUser}
            setToken={setToken}
            chatrooms={chatrooms}
            setSelectChatroom={setSelectChatroom}
          >
            {!token ? (
              <HomeScreen />
            ) : (
              <div className="chat-container d-flex flex-column h-100">
                <MessageList messageList={messageList} />

                {/* Smart Reply Suggestions — shown only when a room is active */}
                {selectChatroom && (
                  <SmartReplySuggestions
                    roomId={selectChatroom}
                    token={token}
                    onSelectSuggestion={handleSuggestionSelect}
                  />
                )}

                <MessageInput
                  setSendMessage={sendMyMessage}
                  prefillMessage={prefillMessage}
                  onPrefillConsumed={handlePrefillConsumed}
                />
              </div>
            )}
          </MainLayout>
        }
      />

      <Route
        path="/register"
        element={
          <MainLayout
            token={token}
            user={user}
            setUser={setUser}
            setToken={setToken}
            chatrooms={chatrooms}
            setSelectChatroom={setSelectChatroom}
          >
            <RegisterForm />
          </MainLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <MainLayout
            token={token}
            user={user}
            setUser={setUser}
            setToken={setToken}
            chatrooms={chatrooms}
            setSelectChatroom={setSelectChatroom}
          >
            <UserProfile token={token} />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
