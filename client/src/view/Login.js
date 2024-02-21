import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * @param {Function} props.onLogin - The function to handle login attempts.
 * @returns {React.ReactElement} The login component.
 */

function Login({ onLogin }) {
  // Local state to hold username and password entered by the user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from causing a page reload
    onLogin(username, password); // Call the onLogin function passed from the Presenter with the current username and password
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Render the login form
  return (
    <div className="login-container">
      <h2>Login</h2>
      {registrationSuccess && (
        <p>Registration successful! You can now log in.</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <p>
          Don'thave an account?
          <button
            type="button"
            className="register-button"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
