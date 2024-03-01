import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

/**
 * Component for user registration.
 * @param {Object} props - The props object.
 * @param {Function} props.onRegister - The function to handle the registration process.
 * @returns {React.ReactElement} The register component.
 */

function Register(props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [pnr, setPnr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
  * Handles form submission for user registration.
  * @param {Event} event - The form submission event.
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    props.onRegister(name, surname, pnr, email, password, username);
  };

  const handleAlreadyHaveAccount = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <h2>{t("register.title")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <label htmlFor="name">{t("register.name")}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("register.enter_name")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">{t("register.surname")}</label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder={t("register.enter_surname")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pnr">{t("register.pnr")}</label>
          <input
            id="pnr"
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            placeholder={t("register.enter_pnr")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">{t("register.email")}</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("register.enter_email")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">{t("register.username")}</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("register.enter_username")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">{t("register.password")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("register.enter_password")}
            required
          />
        </div>
        <button type="submit">{t("register.register_button")}</button>
      </form>
      <p>
        {t("register.already_have_account")}{" "}
        <button onClick={handleAlreadyHaveAccount} className="login-link">
          {t("register.login")}
        </button>
      </p>
    </div>
  );
}

export default Register;
