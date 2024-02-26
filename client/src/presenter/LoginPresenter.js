import React, { useState } from "react";
import Login from "../view/Login";
import { useNavigate } from "react-router-dom";
import "../App.css";

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
        message: "Username must be at least 3 characters long.",
      });
      return;
    }

    if (!isNaN(username.charAt(0))) {
        setLoginStatus({
        isRegistered: false,
        message: "Username must not start with a number.",
      });
      return;
    }

    if (password.length < 6) {
      setLoginStatus({
        isRegistered: false,
        message: "password must be at least 6 characters long.",
      });
      return;
    }
    try {
      console.log("API URL:", process.env.REACT_APP_API_URL);
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
        localStorage.setItem("user", JSON.stringify(data.user)); 
        console.log("users role" + data.user.role); 
        setLoginStatus({
          isLoggedIn: true,
          message: "Login successful",
          user: data.user,
        });

        setTimeout(() => {
          navigate("/dashboard"); 
        }, 2000);
      } else {
        setLoginStatus({
          isLoggedIn: false,
          message: "Invalid credentials", 
          user: null,
        });
      }
    } catch (error) {
      setLoginStatus({
        isLoggedIn: false,
        message: "An error occurred while logging in.", 
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
