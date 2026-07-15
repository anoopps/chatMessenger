import React from "react";
import { Link } from "react-router-dom";

const Profile = ({ user, setUser, setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };
  console.log(`I am loged in ${JSON.stringify(user)}`);

  return (
    <>
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt="mdo"
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>Test</strong>
        </a>

        <ul className="dropdown-menu text-small shadow">
          <li>
            <Link className="dropdown-item" to="/profile">
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={handleLogout}>
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Profile;
