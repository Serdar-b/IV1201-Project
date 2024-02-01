import './App.css';
import React, { useState } from 'react';
import Login from './view/login';

function App() {
  const [loginStatus, setLoginStatus] = useState({ isLoggedIn: false, message: '' });

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoginStatus({ isLoggedIn: data.success, message: data.message });
    } catch (error) {
      setLoginStatus({ isLoggedIn: false, message: 'An error occurred while logging in.' });
    }
  };

  return (
    <div className="App">
      <Login onLogin={handleLogin} />
      {loginStatus.message && <p>{loginStatus.message}</p>}
    </div>
  );
}

export default App;
