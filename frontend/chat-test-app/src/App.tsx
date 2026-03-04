import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ChatRoomList from "./components/ChatRoomList";
import MessageInput from "./components/MessageInput";
import MessageList from "./components/MessageList";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <div data-bs-theme="dark">
      <main className="d-flex flex-nowrap">
        {/* Sidebar Section */}
        <div
          className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
          style={{ width: "20%" }}
        >
          {/* Login Form  */}
          {!user ? (
            <LoginForm setUser={setUser} setToken={setToken} />
          ) : (
            <Profile user={user} setUser={setUser} setToken={setToken} />
          )}

          {/* Chat room list  */}
          <ChatRoomList />
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
