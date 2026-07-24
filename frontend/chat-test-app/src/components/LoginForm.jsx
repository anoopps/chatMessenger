import { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ setUser, setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handelLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const user = await response.json();

      console.log(`Fetched user ${JSON.stringify(user)}`);

      if (!response.ok) {
        console.error("Login failed");
        return;
      }
      setUser(user.data.user);
      setToken(user.data.token);

      const now = new Date();

      const item = {
        token: user.data.token,
        expiry: now.getTime() + 60 * 60 * 1000,
      };

      localStorage.setItem("token", JSON.stringify(item));
    } catch (e) {
      console.error("Error:", e.message);
    }
  };

  return (
    <div className="chatBox">
      <form onSubmit={handelLogin} autoComplete="on">
        <span className="fs-4">
          <h4>Sign in to chat</h4>
        </span>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            value={email}
            autoComplete="username"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            value={password}
            name="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
        <Link to="/register">Register</Link>
      </form>
    </div>
  );
};

export default LoginForm;
