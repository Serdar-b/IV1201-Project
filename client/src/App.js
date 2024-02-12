import './App.css';
import React, { useState } from "react";
import Login from "./view/login";

function App() {
  const [loginStatus, setLoginStatus] = useState({
    isLoggedIn: false,
    message: "",
    user: null,
  });

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setLoginStatus({
          isLoggedIn: true,
          message: "Login successful",
          user: data.user,
        });
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoginStatus({
      isLoggedIn: false,
      message: "You have been logged out.",
      user: null,
    });
  };
  console.log(loginStatus.isLoggedIn === true);
  return (
    <div className="App">
      {!loginStatus.isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <p className="welcome-message">Welcome, {loginStatus.user.name}!</p>
          <p>{loginStatus.message}</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
