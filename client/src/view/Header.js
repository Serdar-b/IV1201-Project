import React from 'react';
import { Link } from 'react-router-dom';
import homeIcon from '../images/home.png';

const Header = () => {
    return (
        <header>
          <nav>
            <div className="nav-content">
                <Link to="/dashboard"><img src={homeIcon} alt="Home" className="home-icon" /></Link>
                <Link to="/dashboard" className="header-link">Grönalund jobb</Link>
                <Link to="/login" className="header-link">Logout</Link> {/* Hardcoded logout, replace later */}
            </div>
          </nav>
        </header>
      );
};

export default Header;