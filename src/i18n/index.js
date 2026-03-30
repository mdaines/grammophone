import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/translation.json";
import zhCNTranslation from "../locales/zh-CN/translation.json";
import zhTWTranslation from "../locales/zh-TW/translation.json";

// Language configuration
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" }
];

export const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(lang => lang.code);
export const DEFAULT_LANGUAGE = "en";

const RESOURCES = {
  en: {
    translation: enTranslation
  },
  "zh-CN": {
    translation: zhCNTranslation
  },
  "zh-TW": {
    translation: zhTWTranslation
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: RESOURCES,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGE_CODES,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupFromPathIndex: 0
    },
    lng: undefined,
    debug: false
  });

export default i18n;
