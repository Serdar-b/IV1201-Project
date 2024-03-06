import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import homeIcon from "../images/home.png";
import "../App.css";
import { useTranslation } from 'react-i18next';

/**
 * Header component that provides navigation links and a logout functionality within the application.
 * It showcases a home icon linked to the dashboard, a jobs link, and a logout button. Logging out
 * removes user data from local storage and redirects to the login page. The component also displays
 * a loading indicator during the logout process to enhance user experience.
 *
 * @component
 * @returns {React.ReactElement} Renders the navigation header with home icon, jobs link, and logout button.
 */
const Header = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { t } = useTranslation();

  /**
   * Handles the user logout process by removing user-related data from local storage
   * and navigating to the login page after a brief delay to simulate a logout process.
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
