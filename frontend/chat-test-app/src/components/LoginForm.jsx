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
    <div>
      <form onSubmit={handelLogin} autoComplete="true">
        <span className="fs-4">
          <h4>Please sign in</h4>
        </span>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            value={email}
            autoComplete="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email address</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            value={password}
            name="password"
            autoComplete="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
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
