import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Login component that provides a user interface for entering login credentials.
 * It renders input fields for the username and password, a login button to submit the credentials,
 * and a link to navigate to the registration page. It also displays a success message if the user
 * navigated from the registration page upon successful registration.
 *
 * @param {Object} props Component properties
 * @param {Function} props.onLogin Callback function to handle user login. It takes username and password as arguments.
 * @returns {React.ReactElement} Renders the login form with username and password fields, and navigation to the registration page.
 */
function Login({ onLogin }) {

  const { t } = useTranslation();

  // Local state to hold username and password entered by the user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

    /**
   * Handles the submission of the login form. Prevents the default form submission behavior, 
   * calls the onLogin callback with the entered username and password, and resets the form fields.
   * @param {React.FormEvent} event The form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault(); 
    onLogin(username, password); 
  };
  
  /**
   * Navigates the user to the registration page when the register button is clicked.
   */
  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Render the login form
  return (
    <div className="login-container">
      <h2>{t("login.title")}</h2>
      {registrationSuccess && <p>{t("register.registration_success")}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">{t("login.username")}</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("login.enter_username")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t("login.password")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("login.enter_password")}
            required
          />
        </div>
        <button type="submit" className="login-button">{t("login.login_button")}</button>
        <p>
          {t("login.register_prompt")}{" "}
          <button type="button" className="register-button" onClick={handleRegisterClick}>
            {t("login.register_button")}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
