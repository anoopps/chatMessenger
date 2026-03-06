import { useState } from "react";

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
      localStorage.setItem("token", user.data.token);
    } catch (e) {
      console.error("Error:", e.message);
    }
  };

  return (
    <div>
      <form onSubmit={handelLogin}>
        <span className="fs-4">Please sign in</span>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            value={email}
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
