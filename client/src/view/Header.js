import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../images/home.png";
import "../App.css";

/**
 * Component for displaying the header navigation.
 * @returns {React.ReactElement} The header component.
 */

const Header = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handles the logout process.
   * Removes user data from local storage and navigates to the login page.
   */
  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("user");

    setTimeout(() => {
      setIsLoggingOut(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <header>
      <nav>
        <div className="nav-content">
          {!isLoggingOut ? (
            <>
              <Link to="/dashboard">
                <img src={homeIcon} alt="Home" className="home-icon" />
              </Link>
              <Link to="/dashboard" className="header-link">
                Grönalund jobb
              </Link>
              <button onClick={handleLogout} className="header-link">
                Logout
              </button>
            </>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
