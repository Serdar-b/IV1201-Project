import React, { useState } from "react";
import Register from "../view/Register";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

/**
 * Presenter component for handling user registration functionality.
 * @returns {React.ReactElement} The Register component with an onRegister handler if not already registered,
 * otherwise displays a success message.
 */

const RegisterPresenter = () => {
  const [registerStatus, setRegisterStatus] = useState({
    isRegistered: false, 
    message: "", 
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
   * Handles the registration process. It sends the user details to the backend for registration,
   * updates the registration state based on the response, and navigates to the login page on success.
   * @param {string} name - The user's name.
   * @param {string} surname - The user's surname.
   * @param {string} pnr - The user's personal identification number.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @param {string} username - The desired username for the user.
   */

  const handleRegister = async (name, surname, pnr, email, password, username) => {
    
    // username validation
    if (username.length < 3) {
      setRegisterStatus({
        isRegistered: false,
        message: t("login.three_characters_long"),
      });
      return;
    }

    // password validation
    if (password.length < 6) {
      setRegisterStatus({
        isRegistered: false,
        message: t("login.password_atleast_six_characters"),
      });
      return;
    }

    // PNR validation
    if (isNaN(pnr) || pnr.includes(".")) {
      setRegisterStatus({
        isRegistered: false,
        message: t("register.pnr_must_be_a_number"),
      });
      return;
    }

    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
      setRegisterStatus({
        isRegistered: false,
        message: t("register.valid_email"),
      });
      return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept-Language': i18n.language,
        },
        body: JSON.stringify({ name, surname, pnr, email, password, username }),
      });

      const data = await response.json();

      if (data.success) {
        setRegisterStatus({
          isRegistered: true,
          message: t("register.registration_successful"),
        });
        navigate("/login", { state: { registrationSuccess: true } });
      } else {
        setRegisterStatus({
          isRegistered: false,
          message: t(data.message) || t("register.registration_failed"),
        });
      }
    } catch (error) {
      setRegisterStatus({
        isRegistered: false,
        message: t("register.registration_error"),
      });
    }
  };

  return (
    <div>
      {!registerStatus.isRegistered ? (
        <div>
          <Register onRegister={handleRegister} />
          <p>{registerStatus.message}</p>
        </div>
      ) : (
        <div>
          <p>{t("register.registration_success")}</p>
        </div>
      )}
    </div>
  );
};

export default RegisterPresenter;
