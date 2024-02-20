import React, { useState } from "react";
import Login from "../view/Login";
import { useNavigate } from "react-router-dom";
import "../App.css";
const LoginPresenter = () => {
  const [loginStatus, setLoginStatus] = useState({
    isLoggedIn: false,
    message: "",
    user: null,
  });

  const navigate = useNavigate();
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Needed to include the cookie with the request
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
          {<div className="loader"></div>}
          <div>
            <p>{loginStatus.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPresenter;
