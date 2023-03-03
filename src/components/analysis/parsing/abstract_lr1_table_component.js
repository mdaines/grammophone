const { fillArray, formatSymbol, formatProduction } = require("../../helpers.js");
const END = require("../../../grammar/symbols").END;

module.exports = function({ getCalculation, tableCalculation }) {
  const info = getCalculation("grammar.symbolInfo");
  const table = getCalculation(tableCalculation);
  const productions = getCalculation("grammar.productions");

  return (
    <table class="symbols lr1-table">
      <colgroup>
        <col />
      </colgroup>
      <colgroup class="t">
        {fillArray(info.terminals.size + 1, <col />)}
      </colgroup>
      <colgroup class="nt">
        {fillArray(info.nonterminals.size, <col />)}
      </colgroup>

      <tr>
        <th>State</th>
        {
          info.terminalOrder.map(function(symbol) {
            return <th>{formatSymbol(symbol, info)}</th>;
          })
        }
        <th>{formatSymbol(END, info)}</th>
        {
          info.nonterminalOrder.map(function(symbol) {
            return <th>{formatSymbol(symbol, info)}</th>;
          })
        }
      </tr>

      {
        table.map(function(state, index) {
          return (
            <tr>
              <th scope="row">{index}</th>
              {
                info.terminalOrder.concat(END).map(function(s) {
                  if (typeof state[s] === "undefined") {
                    return <td />;
                  } else {
                    let actions = [];

                    if (typeof state[s].shift !== "undefined") {
                      actions.push(<li>{`shift(${state[s].shift})`}</li>);
                    }

                    if (typeof state[s].reduce !== "undefined") {
                      state[s].reduce.forEach(function(p) {
                        if (p === -1) {
                          actions.push(<li>{"accept"}</li>);
                        } else {
                          actions.push(
                            <li>
                              {"reduce("}
                              {formatProduction(productions[p], info)}
                              {")"}
                            </li>
                          );
                        }
                      });
                    }

                    let isConflict = (typeof state[s].shift === "undefined" ? 0 : 1) + (typeof state[s].reduce !== "undefined" ? state[s].reduce.length : 0) > 1;

                    return (
                      <td class={isConflict ? "conflict" : ""}>
                        <ul>{actions}</ul>
                      </td>
                    );
                  }
                })
              }
              {
                info.nonterminalOrder.map(function(s) {
                  if (typeof state[s] === "undefined") {
                    return <td />;
                  } else if (typeof state[s].shift === "undefined") {
                    return <td><ul /></td>;
                  } else {
                    return (
                      <td>
                        <ul>
                          <li>{state[s].shift}</li>
                        </ul>
                      </td>
                    );
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
