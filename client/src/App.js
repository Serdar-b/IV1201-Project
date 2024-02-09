import "./App.css";
import React, { useState } from "react";
import Login from "./view/login";

function App() {
  const [loginStatus, setLoginStatus] = useState({
    isLoggedIn: false,
    message: "",
    user: null,
  });

  // it sends the username and password using http method
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setLoginStatus({
          isLoggedIn: true,
          message: data.message,
          user: data.user,
        });
      } else {
        setLoginStatus({
          isLoggedIn: false,
          message: data.message,
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
    <div className="App">
      <Login onLogin={handleLogin} />
      {loginStatus.message && <p>{loginStatus.message}</p>}
      {loginStatus.isLoggedIn && loginStatus.user && (
        <div>
          <p className="welcome-message">Welcome, {loginStatus.user.name}!</p>
        </div>
      )}
    </div>
  );
}

export default App;
