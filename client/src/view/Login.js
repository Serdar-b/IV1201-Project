import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


/**
 * @param {Function} props.onLogin - The function to handle login attempts.
 * @returns {React.ReactElement} The login component.
 */

function Login({ onLogin }) {

  const { t } = useTranslation();

  // Local state to hold username and password entered by the user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); 
    onLogin(username, password); 
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Render the login form
  return (
    <div className="login-container">
      <h2>{t("login.title")}</h2>
      {registrationSuccess && <p>{t("login.registration_success")}</p>}
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
