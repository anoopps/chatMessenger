import React from "react";

const Register = () => {
  return (
    <div className="p-4 text-light bg-dark h-100">
      <h2>Register</h2>

      <form className="mt-4">
        <input type="text" placeholder="Name" className="form-control mb-3" />

        <input type="email" placeholder="Email" className="form-control mb-3" />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
        />

        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
