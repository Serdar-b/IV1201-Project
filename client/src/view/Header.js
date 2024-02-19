import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import homeIcon from '../images/home.png';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login'); 
  }

  return (
      <header>
        <nav>
          <div className="nav-content">
              <Link to="/dashboard"><img src={homeIcon} alt="Home" className="home-icon" /></Link>
              <Link to="/dashboard" className="header-link">Grönalund jobb</Link>
              <button onClick={handleLogout} className="header-link">Logout</button>
          </div>
        </nav>
      </header>
    );
};

export default Header;
