import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../images/home.png";
import "../App.css";
import { useTranslation } from 'react-i18next';

/**
 * Component for displaying the header navigation.
 * @returns {React.ReactElement} The header component.
 */

const Header = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  /**
   * Handles the logout process.
   * Removes user data from local storage and navigates to the login page.
   */
  const handleLogout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

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
                <img src={homeIcon} alt={t("header.home")} className="home-icon" />
              </Link>
              <Link to="/dashboard" className="header-link">
                {t("header.jobs")} 
              </Link>
              <button onClick={handleLogout} className="header-link">
                {t("header.logout")}
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
