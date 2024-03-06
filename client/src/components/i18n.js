/**
 * Configures internationalization for the application using i18next and react-i18next.
 * It loads translations from JSON files and initializes i18next with these resources.
 * 
 * @module i18nConfig
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationen from "../locales/translationen.json";
import translationfr from "../locales/translationfr.json";
import translationes from "../locales/translationes.json";
import translationtr from "../locales/translationtr.json";

/**
 * An object containing all the translations for supported languages.
 * Each language key maps to an object with a `translation` property that contains the language's translations.
 * @type {Object.<string, {translation: Object}>}
 */
const resources = {
  en: { translation: translationen },
  fr: { translation: translationfr },
  es: { translation: translationes },
  tr: { translation: translationtr },
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
