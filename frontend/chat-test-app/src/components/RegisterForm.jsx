import React, { useState } from "react";
import { apiFetch } from "../utils/api.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterForm = () => {
  // initialization
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const registerUserFunction = async (e) => {
    e.preventDefault();

    const response = await apiFetch(
      `${API_BASE_URL}/auth/register`,
      "POST",
      "",
      "User registration",
      {
        name,
        email,
        password,
      }
    );

    console.log(response);

    console.log(response.success);
    if (response.success) {
      setSuccessMessage("User registered successfully!");
      setErrorMessage("");
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setErrorMessage("Usr registration Failed");
      setSuccessMessage("");
    }
  };

  return (
    <div className="p-4 text-light bg-dark h-100">
      <h2>Register</h2>

      <form className="mt-4" onSubmit={registerUserFunction}>
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-3"
          onChange={(e) => setName(e.target.value)}
          name="userName"
          value={name}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          value={email}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        <button type="submit" className="btn btn-primary">
          Register
        </button>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
