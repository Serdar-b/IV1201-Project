import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Footer component that displays contact information and an address.
 * It uses the `useTranslation` hook from `react-i18next` to support internationalization
 * by rendering the text in the current language set in the application.
 *
 * @component
 * @returns {React.ReactElement} The Footer component containing contact information.
 */
const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="black">{t("footer.contact_us")}</p>
        <p className="black">{t("footer.email")}</p>
        <p className="black">{t("footer.phone")}</p>
        <address>{t("footer.address")}</address>
      </div>
    </footer>
  );
};

export default Footer;
