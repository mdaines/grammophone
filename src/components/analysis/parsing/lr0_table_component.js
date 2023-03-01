const { fillArray, formatSymbol, formatProduction } = require("../../../jsx_helpers");
const END = require("../../../grammar/symbols").END;

module.exports = function({ getCalculation }) {
  const info = getCalculation("grammar.symbolInfo");
  const table = getCalculation("parsing.lr.lr0_table");
  const productions = getCalculation("grammar.productions");

  return (
    <table class="symbols lr0-table">
      <colgroup>
        <col />
      </colgroup>
      <colgroup class="t">
        {fillArray(info.terminals.size, <col />)}
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
                info.terminalOrder.map(function(s) {
                  let actions = [];

                  if (typeof state.shift[s] !== "undefined") {
                    actions.push(<li>{`shift(${state.shift[s]})`}</li>);
                  }

                  state.reduce.forEach(function(p) {
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

                  let isConflict = (typeof state.shift[s] === "undefined" ? 0 : 1) + state.reduce.length > 1;

                  return (
                    <td class={isConflict ? "conflict" : ""}>
                      <ul>{actions}</ul>
                    </td>
                  );
                })
              }

              {
                info.nonterminalOrder.map(function(s) {
                  return (
                    <td>
                      <ul>{typeof state.shift[s] !== "undefined" ? <li>{state.shift[s]}</li> : null}</ul>
                    </td>
                  );
                })
              }
            </tr>
          );
        })
      }
    </table>
  );
}
