import React, { useState } from "react";
import Login from "../view/Login";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useTranslation } from 'react-i18next';

/**
 * Presenter component for handling user login functionality.
 * @returns {React.ReactElement} The Login component with an onLogin handler if not logged in,
 * otherwise displays a loader animation and a success message before redirecting.
 */

const LoginPresenter = () => {
  const [loginStatus, setLoginStatus] = useState({
    isLoggedIn: false,
    message: "",
    user: null,
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Handles the user login process.
   * @param {string} username - The username entered by the user.
   * @param {string} password - The password entered by the user.
   */

  const handleLogin = async (username, password) => {
    if (username.length < 3) {
      setLoginStatus({
        isRegistered: false,
        message: t("login.three_characters_long"),
      });
      return;
    }

    if (!isNaN(username.charAt(0))) {
      setLoginStatus({
        isRegistered: false,
        message: t("login.username_not_start_with_number"),
      });
      return;
    }

    if (password.length < 6) {
      setLoginStatus({
        isRegistered: false,
        message: t("login.password_atleast_six_characters"),
      });
      return;
    }
    try {
      console.log("API URL:", process.env.REACT_APP_API_URL);
      console.log('API URL:', process.env.REACT_APP_API_URL);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        // const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log("users role" + data.user.role);
        setLoginStatus({
          isLoggedIn: true,
          message: t("login.login_successful"),
          user: data.user,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setLoginStatus({
          isLoggedIn: false,
          message: data.message || t("login.invalid_credentials"),
          user: null,
        });
      }
    } catch (error) {
      setLoginStatus({
        isLoggedIn: false,
        message: t("login.login_error"),
        user: null,
      });
    }
  };

  return (
    <div>
      {!loginStatus.isLoggedIn ? (
        <div>
          <Login onLogin={handleLogin} />
          <p>{loginStatus.message}</p>
        </div>
      ) : (
        <div>
          {<div className="loader"></div>}{" "}
          <div>
            <p>{loginStatus.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPresenter;
