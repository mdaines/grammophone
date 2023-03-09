import { formatSymbol, formatSymbolList, listSymbols } from "../helpers.js";

export default function({ getCalculation }) {
  const nullable = getCalculation("grammar.nullable");
  const endable = getCalculation("grammar.endable");
  const first = getCalculation("grammar.first");
  const follow = getCalculation("grammar.follow");
  const info = getCalculation("grammar.symbolInfo");

  return (
    <>
      <h1>Nonterminals</h1>

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
          {
            info.productionOrder.map(function(symbol) {
              const firstSymbols = first.get(symbol);
              const followSymbols = follow.get(symbol);

              return (
                <tr key={symbol}>
                  <td>{formatSymbol(symbol, info)}</td>
                  <td>{nullable.has(symbol) ? "Nullable" : ""}</td>
                  <td>{endable.has(symbol) ? "Endable" : ""}</td>
                  <td>{formatSymbolList(listSymbols(firstSymbols, info.terminalOrder), info)}</td>
                  <td>{formatSymbolList(listSymbols(followSymbols, info.terminalOrder), info)}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </>
  );
}
