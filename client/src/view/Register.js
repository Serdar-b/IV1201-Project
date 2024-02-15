import React, { useState } from "react";

function Register(props) {
  
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [pnr, setPnr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  

  const handleSubmit = (event) => {
    event.preventDefault();
    // Make sure to pass all the state variables to the onRegister prop function
    props.onRegister( name, surname, pnr, email, password, username);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Surname</label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder="Enter surname"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pnr">PNR</label>
          <input
            id="pnr"
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            placeholder="Enter pnr"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
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
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
