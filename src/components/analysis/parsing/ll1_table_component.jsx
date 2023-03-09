import { fillArray, formatSymbol, formatProduction } from "../../helpers.js";
import { END } from "../../../grammar/symbols.js";

export default function({ getCalculation }) {
  const info = getCalculation("grammar.symbolInfo");
  const table = getCalculation("parsing.ll.ll1_table");
  const productions = getCalculation("grammar.productions");

  return (
    <table className="symbols ll1-table">
      <colgroup>
        <col />
      </colgroup>
      <colgroup className="t">
        {fillArray(info.terminals.size + 1, (index) => <col key={index} />)}
      </colgroup>

      <thead>
        <tr>
          <th />
          {
            info.terminalOrder.map(function(symbol, index) {
              return <th key={index}>{formatSymbol(symbol, info)}</th>;
            })
          }
          <th>{formatSymbol(END, info)}</th>
        </tr>
      </thead>

      <tbody>
        {
          info.productionOrder.map(function(nt, index) {
            return (
              <tr key={index}>
                <th scope="row">{formatSymbol(nt, info)}</th>
                {
                  info.terminalOrder.concat(END).map(function(t, index) {
                    if (typeof table[nt][t] !== "undefined") {
                      return (
                        <td key={index} className={table[nt][t].length > 1 ? "conflict" : ""}>
                          <ul>
                            {
                              table[nt][t].map(function(p, index) {
                                return <li key={index}>{formatProduction(productions[p], info)}</li>;
                              })
                            }
                          </ul>
                        </td>
                      );
                    } else {
                      return <td key={index} />;
                    }
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}
