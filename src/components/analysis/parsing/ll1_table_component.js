const { fillArray, formatSymbol, formatProduction } = require("../../../helpers.js");
const END = require("../../../grammar/symbols").END;

module.exports = function({ getCalculation }) {
  const info = getCalculation("grammar.symbolInfo");
  const table = getCalculation("parsing.ll.ll1_table");
  const productions = getCalculation("grammar.productions");

  return (
    <table class="symbols ll1-table">
      <colgroup>
        <col />
      </colgroup>
      <colgroup class="t">
        {fillArray(info.terminals.size + 1, <col />)}
      </colgroup>

      <tr>
        <th />
        {
          info.terminalOrder.map(function(symbol) {
            return <th>{formatSymbol(symbol, info)}</th>;
          })
        }
        <th>{formatSymbol(END, info)}</th>
      </tr>

      {
        info.productionOrder.map(function(nt) {
          return (
            <tr>
              <th scope="row">{formatSymbol(nt, info)}</th>
              {
                info.terminalOrder.concat(END).map(function(t) {
                  if (typeof table[nt][t] !== "undefined") {
                    return (
                      <td class={table[nt][t].length > 1 ? "conflict" : ""}>
                        <ul>
                          {
                            table[nt][t].map(function(p) {
                              return <li>{formatProduction(productions[p], info)}</li>;
                            })
                          }
                        </ul>
                      </td>
                    );
                  } else {
                    return <td />;
                  }
                })
              }
            </tr>
          );
        })
      }
    </table>
  );
}
