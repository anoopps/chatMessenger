import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfile = (token) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    getUserDetails(token);
  }, []);

  const getUserDetails = async (token) => {
    if (!token.userToken) return;
    const response = await apiFetch(
      `${API_BASE_URL}/user`,
      "GET",
      token.userToken
    );
    const user = response.data.userData;

    setName(user.name);
    setEmail(user.email);
    setIsActive(user.is_active);
  };

  return (
    <div className="container mt-4">
      <div className="col-md-6">
        <h2>User Profile</h2>
        <div className="mb-3">
          <label className="form-label">Name</label>

          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>

          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />

          <label className="form-check-label">Is Active</label>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
