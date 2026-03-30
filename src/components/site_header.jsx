import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./language_switcher.jsx";

export default function SiteHeader() {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("header.title")}</h1>
      <ul>
        <li>
          <a href="https://github.com/mdaines/grammophone/wiki">
            {t("header.help")}
          </a>
        </li>
        <li>
          <a href="https://github.com/mdaines/grammophone/wiki/Example-Grammars">
            {t("header.examples")}
          </a>
        </li>
        <li>
          <a href="https://github.com/mdaines/grammophone">
            {t("header.github")}
          </a>
        </li>
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </>
  );
}
