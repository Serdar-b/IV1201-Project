import React from 'react';
import { useTranslation } from 'react-i18next';

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
