import PropTypes from "prop-types";
import { formatSymbol, formatSymbolList, listSymbols } from "../helpers.js";

export const ID = "nonterminals";
export const TITLE = "Nonterminals";

export default function NonterminalsComponent({ grammar }) {
  const { nullable, endable, first, follow, symbolInfo } = grammar.calculations;

  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>

      <table className="symbols">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Nullable?</th>
            <th>Endable?</th>
            <th>First set</th>
            <th>Follow set</th>
          </tr>
        </thead>

        <tbody>
          {symbolInfo.productionOrder.map(function (symbol) {
            const firstSymbols = first.get(symbol);
            const followSymbols = follow.get(symbol);

            return (
              <tr key={symbol}>
                <td>{formatSymbol(symbol, symbolInfo)}</td>
                <td>{nullable.has(symbol) ? "Nullable" : ""}</td>
                <td>{endable.has(symbol) ? "Endable" : ""}</td>
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
