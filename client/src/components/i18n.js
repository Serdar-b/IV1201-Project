/**
 * Configures internationalization for the application using i18next and react-i18next.
 * It loads translations from JSON files and initializes i18next with these resources.
 * 
 * @module i18nConfig
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../locales/translationEN.json";
import translationFR from "../locales/translationFR.json";
import translationES from "../locales/translationES.json";
import translationTR from "../locales/translationTR.json";

/**
 * An object containing all the translations for supported languages.
 * Each language key maps to an object with a `translation` property that contains the language's translations.
 * @type {Object.<string, {translation: Object}>}
 */
const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  es: { translation: translationES },
  tr: { translation: translationTR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
