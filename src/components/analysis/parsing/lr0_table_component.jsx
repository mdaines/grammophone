import { fillArray, formatSymbol, formatProduction } from "../../helpers.js";

export const ID = "lr0_table";
export const TITLE = "LR(0) Parsing Table";

export default function({ grammar }) {
  const { symbolInfo, lr0Table: table, productions } = grammar.calculations;

  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>

      <table className="symbols lr0-table">
        <colgroup>
          <col />
        </colgroup>
        <colgroup className="t">
          {fillArray(symbolInfo.terminals.size, (index) => <col key={index} />)}
        </colgroup>
        <colgroup className="nt">
          {fillArray(symbolInfo.nonterminals.size, (index) => <col key={index} />)}
        </colgroup>

        <thead>
          <tr>
            <th>State</th>
            {
              symbolInfo.terminalOrder.map(function(symbol, index) {
                return <th key={"t"+index}>{formatSymbol(symbol, symbolInfo)}</th>;
              })
            }
            {
              symbolInfo.nonterminalOrder.map(function(symbol, index) {
                return <th key={"nt"+index}>{formatSymbol(symbol, symbolInfo)}</th>;
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
                    symbolInfo.terminalOrder.map(function(s, index) {
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
                              {formatProduction(productions[p], symbolInfo)}
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
                    symbolInfo.nonterminalOrder.map(function(s, index) {
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
    </section>
  );
}
