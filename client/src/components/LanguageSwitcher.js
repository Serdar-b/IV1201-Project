import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();

  const changeLanguage = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="language-switcher-container">
        <h3>
          {t("language_switcher.choose_language")}
        </h3>
        <select value={i18n.language} onChange={changeLanguage}>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
        </select>
    </div>
  );
}

export default LanguageSwitcher;
