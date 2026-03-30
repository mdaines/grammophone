import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { formatSymbol, formatSymbolList, listSymbols } from "../helpers.js";

export const ID = "nonterminals";
export const TITLE = "analysis." + ID;

export default function NonterminalsComponent({ grammar }) {
  const { t } = useTranslation();
  const { nullable, endable, first, follow, symbolInfo } = grammar.calculations;

  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>

      <table className="symbols">
        <thead>
          <tr>
            <th>{t("tables.symbol")}</th>
            <th>{t("tables.nullable")}</th>
            <th>{t("tables.endable")}</th>
            <th>{t("tables.firstSet")}</th>
            <th>{t("tables.followSet")}</th>
          </tr>
        </thead>

        <tbody>
          {symbolInfo.productionOrder.map(function (symbol) {
            const firstSymbols = first.get(symbol);
            const followSymbols = follow.get(symbol);

            return (
              <tr key={symbol}>
                <td>{formatSymbol(symbol, symbolInfo)}</td>
                <td>{nullable.has(symbol) ? t("tables.nullableValue") : ""}</td>
                <td>{endable.has(symbol) ? t("tables.endableValue") : ""}</td>
                <td>
                  {formatSymbolList(
                    listSymbols(firstSymbols, symbolInfo.terminalOrder),
                    symbolInfo
                  )}
                </td>
                <td>
                  {formatSymbolList(
                    listSymbols(followSymbols, symbolInfo.terminalOrder),
                    symbolInfo
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

NonterminalsComponent.propTypes = {
  grammar: PropTypes.shape({
    calculations: PropTypes.shape({
      nullable: PropTypes.instanceOf(Set).isRequired,
      endable: PropTypes.instanceOf(Set).isRequired,
      first: PropTypes.instanceOf(Map).isRequired,
      follow: PropTypes.instanceOf(Map).isRequired,
      symbolInfo: PropTypes.shape({
        productionOrder: PropTypes.array.isRequired,
        terminalOrder: PropTypes.array.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};
