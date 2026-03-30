import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const ID = "parsing";
export const TITLE = "analysis." + ID;

export default function ParsingComponent({ grammar }) {
  const { t } = useTranslation();
  const { classification } = grammar.calculations;

  function formatClassification(cs, c) {
    if (cs[c].member) {
      return t("parsing.classification", { algorithm: t("parsing." + c) });
    } else {
      return (
        <span className="conflict">
          {t("parsing.notClassification", {
            algorithm: t("parsing." + c),
            reason: t(cs[c].reason.key, cs[c].reason.options)
          })}
        </span>
      );
    }
  }

  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>
      <table className="parsing-algorithm-table">
        <tbody>
          <tr>
            <th scope="row">{t("parsing.ll1")}</th>
            <td className="classification">
              {formatClassification(classification, "ll1")}
            </td>
            <td>
              <a href="#/ll1-table">{t("parsing.parsingTable")}</a>
            </td>
          </tr>
          <tr>
            <th scope="row">{t("parsing.lr0")}</th>
            <td className="classification">
              {formatClassification(classification, "lr0")}
            </td>
            <td>
              <a href="#/lr0-automaton">{t("parsing.automaton")}</a>
              {", "}
              <a href="#/lr0-table">{t("parsing.parsingTable")}</a>
            </td>
          </tr>
          <tr>
            <th scope="row">{t("parsing.slr1")}</th>
            <td className="classification">
              {formatClassification(classification, "slr1")}
            </td>
            <td>
              <a href="#/slr1-table">{t("parsing.parsingTable")}</a>
            </td>
          </tr>
          <tr>
            <th scope="row">{t("parsing.lr1")}</th>
            <td className="classification">
              {formatClassification(classification, "lr1")}
            </td>
            <td>
              <a href="#/lr1-automaton">{t("parsing.automaton")}</a>
              {", "}
              <a href="#/lr1-table">{t("parsing.parsingTable")}</a>
            </td>
          </tr>
          <tr>
            <th scope="row">{t("parsing.lalr1")}</th>
            <td className="classification">
              {formatClassification(classification, "lalr1")}
            </td>
            <td>
              <a href="#/lalr1-automaton">{t("parsing.automaton")}</a>
              {", "}
              <a href="#/lalr1-table">{t("parsing.parsingTable")}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

ParsingComponent.propTypes = {
  grammar: PropTypes.shape({
    calculations: PropTypes.shape({
      classification: PropTypes.object.isRequired
    }).isRequired
  }).isRequired
};
