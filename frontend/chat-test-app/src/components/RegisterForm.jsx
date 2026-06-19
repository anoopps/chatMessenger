import React, { useState } from "react";

const RegisterForm = () => {
  // initialization
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUserFunction = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    console.log(response);
  };

  return (
    <div className="p-4 text-light bg-dark h-100">
      <h2>Register</h2>

      <form className="mt-4">
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-3"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control mb-3"
          onChange={(e) => checkPassword(e.target.value)}
        />

        <a className="btn btn-primary" onClick={registerUserFunction}>
          Register
        </a>
      </form>
    </div>
  );
};

export default RegisterForm;
