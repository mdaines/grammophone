import { fillArray, formatSymbol, formatProduction } from "../../helpers.js";
import { END } from "../../../grammar/symbols.js";

export const ID = "ll1_table";
export const TITLE = "LL(1) Parsing Table";

export default function({ grammar }) {
  const { symbolInfo, ll1Table: table, productions } = grammar.calculations;

  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>

      <table className="symbols ll1-table">
        <colgroup span="1"></colgroup>
        <colgroup className="t" span={symbolInfo.terminals.size + 1}></colgroup>

        <thead>
          <tr>
            <th />
            {
              symbolInfo.terminalOrder.map(function(symbol, index) {
                return <th key={index}>{formatSymbol(symbol, symbolInfo)}</th>;
              })
            }
            <th>{formatSymbol(END, symbolInfo)}</th>
          </tr>
        </thead>

        <tbody>
          {
            symbolInfo.productionOrder.map(function(nt, index) {
              return (
                <tr key={index}>
                  <th scope="row">{formatSymbol(nt, symbolInfo)}</th>
                  {
                    symbolInfo.terminalOrder.concat(END).map(function(t, index) {
                      if (typeof table[nt][t] !== "undefined") {
                        return (
                          <td key={index} className={table[nt][t].length > 1 ? "conflict" : ""}>
                            <ul>
                              {
                                table[nt][t].map(function(p, index) {
                                  return <li key={index}>{formatProduction(productions[p], symbolInfo)}</li>;
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
    </section>
  );
}
