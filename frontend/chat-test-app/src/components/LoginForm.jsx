import { useState } from "react";

const LoginForm = ({ setUser, setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelLogin = () => {};

  return (
    <div>
      <form>
        <span className="fs-4">Please sign in</span>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label>Email address</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label>Password</label>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          onClick={handelLogin}
        >
          Sign in
        </button>
      </form>

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
          <strong>Anoop</strong>
        </a>
        <ul className="dropdown-menu text-small shadow">
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginForm;
