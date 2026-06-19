import React from "react";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import ChatRoomList from "./components/ChatRoomList";

function MainLayout({
  token,
  user,
  setUser,
  setToken,
  chatrooms,
  setSelectChatroom,
  children,
}) {
  return (
    <div data-bs-theme="dark">
      <main className="d-flex flex-nowrap">
        <div
          className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
          style={{ width: "20%" }}
        >
          {!token ? (
            <LoginForm setUser={setUser} setToken={setToken} />
          ) : (
            <Profile user={user} setUser={setUser} setToken={setToken} />
          )}

          {token && (
            <ChatRoomList
              chatrooms={chatrooms}
              setSelectChatroom={setSelectChatroom}
              token={token}
            />
          )}
        </div>

        <div className="d-flex flex-column flex-fill p-3 bg-dark text-light">
          {children}
        </div>
        <div className="b-example-divider b-example-vr"></div>
      </main>
    </div>
  );
}

export default MainLayout;
