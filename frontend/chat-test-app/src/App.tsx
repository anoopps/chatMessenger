import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import ChatRoomList from "./components/ChatRoomList";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import Profile from "./components/Profile";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [chatrooms, setChatrooms] = useState(null);
  const [selectChatroom, setSelectChatroom] = useState(null);

  console.log(user);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);
    if (storedToken) {
      setToken(storedToken);
      setUser({ loggedIn: true });
    }
    getChatroom();
  }, [token]);

  const getChatroom = async () => {
    if (!token) return;
    const chatroomResponse = await fetch(`${API_BASE_URL}/chatrooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("chatrom dat");
    const rooms = await chatroomResponse.json();
    console.log("My chatrooms");
    setChatrooms(rooms.data);
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
            />
          )}
        </div>

        {/* Content Section */}
        <div className="d-flex flex-column flex-fill p-3 bg-dark text-light">
          {/* Chat Header */}
          <MessageList />
          {/* Input Area */}
          <MessageInput />
        </div>
        <div className="b-example-divider b-example-vr"></div>
      </main>
    </div>
  );
}

export default App;
