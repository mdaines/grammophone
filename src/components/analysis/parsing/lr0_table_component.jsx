import { fillArray, formatSymbol, formatProduction } from "../../helpers.js";

export default function({ getCalculation }) {
  const info = getCalculation("grammar.symbolInfo");
  const table = getCalculation("parsing.lr.lr0_table");
  const productions = getCalculation("grammar.productions");

  return (
    <table className="symbols lr0-table">
      <colgroup>
        <col />
      </colgroup>
      <colgroup className="t">
        {fillArray(info.terminals.size, (index) => <col key={index} />)}
      </colgroup>
      <colgroup className="nt">
        {fillArray(info.nonterminals.size, (index) => <col key={index} />)}
      </colgroup>

      <thead>
        <tr>
          <th>State</th>
          {
            info.terminalOrder.map(function(symbol, index) {
              return <th key={"t"+index}>{formatSymbol(symbol, info)}</th>;
            })
          }
          {
            info.nonterminalOrder.map(function(symbol, index) {
              return <th key={"nt"+index}>{formatSymbol(symbol, info)}</th>;
            })
          }
        </tr>
      </thead>

      <tbody>
        {
          table.map(function(state, index) {
            return (
              <tr key={index}>
                <th scope="row">{index}</th>
                {
                  info.terminalOrder.map(function(s, index) {
                    let actions = [];

                    if (typeof state.shift[s] !== "undefined") {
                      actions.push(<li key="s">{`shift(${state.shift[s]})`}</li>);
                    }

                    state.reduce.forEach(function(p, index) {
                      if (p === -1) {
                        actions.push(<li key={"r"+index}>{"accept"}</li>);
                      } else {
                        actions.push(
                          <li key={"r"+index}>
                            {"reduce("}
                            {formatProduction(productions[p], info)}
                            {")"}
                          </li>
                        );
                      }
                    });

                    let isConflict = (typeof state.shift[s] === "undefined" ? 0 : 1) + state.reduce.length > 1;

                    return (
                      <td key={"t"+index} className={isConflict ? "conflict" : ""}>
                        <ul>{actions}</ul>
                      </td>
                    );
                  })
                }

                {
                  info.nonterminalOrder.map(function(s, index) {
                    return (
                      <td key={"nt"+index}>
                        <ul>{typeof state.shift[s] !== "undefined" ? <li>{state.shift[s]}</li> : null}</ul>
                      </td>
                    );
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
