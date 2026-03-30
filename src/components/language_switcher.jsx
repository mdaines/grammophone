import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../i18n/index.js";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div id="language-switcher">
      <select
        value={currentLanguage}
        onChange={e => changeLanguage(e.target.value)}
      >
        {SUPPORTED_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
