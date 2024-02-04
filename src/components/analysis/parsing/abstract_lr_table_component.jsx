import { fillArray, formatSymbol, formatProduction } from "../../helpers.js";
import { END } from "../../../grammar/symbols.js";

function isConflict(actions) {
  return (typeof actions.shift === "undefined" ? 0 : 1) + (typeof actions.reduce !== "undefined" ? actions.reduce.length : 0) > 1;
}

export default function({ grammar, table, includeEnd }) {
  const { productions, symbolInfo } = grammar.calculations;
  const terminalColumnCount = symbolInfo.terminals.size + (includeEnd ? 1 : 0);
  const nonterminalColumnCount = symbolInfo.nonterminals.size;

  return (
    <table className="symbols lr-table">
      <colgroup span="1"></colgroup>
      {terminalColumnCount > 0 ? <colgroup className="t" span={terminalColumnCount}></colgroup> : []}
      {nonterminalColumnCount > 0 ? <colgroup className="nt" span={nonterminalColumnCount}></colgroup> : []}

      <thead>
        <tr>
          <th>State</th>
          {
            symbolInfo.terminalOrder.map(function(symbol, index) {
              return <th key={"t"+index}>{formatSymbol(symbol, symbolInfo)}</th>;
            })
          }
          {
            includeEnd ? <th>{formatSymbol(END, symbolInfo)}</th> : []
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
                  symbolInfo.terminalOrder.concat(includeEnd ? END : []).map(function(s, index) {
                    if (typeof state[s] === "undefined") {
                      return <td key={"t"+index} />;
                    } else {
                      let actions = [];

                      if (typeof state[s].shift !== "undefined") {
                        actions.push(<li key="s">{`shift(${state[s].shift})`}</li>);
                      }

                      if (typeof state[s].reduce !== "undefined") {
                        state[s].reduce.forEach(function(p, index) {
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
                      }

                      return (
                        <td key={"t"+index} className={isConflict(state[s]) ? "conflict" : ""}>
                          <ul>{actions}</ul>
                        </td>
                      );
                    }
                  })
                }
                {
                  symbolInfo.nonterminalOrder.map(function(s, index) {
                    if (typeof state[s] === "undefined") {
                      return <td key={"nt"+index} />;
                    } else if (typeof state[s].shift === "undefined") {
                      return <td key={"nt"+index}><ul /></td>;
                    } else {
                      return (
                        <td key={"nt"+index}>
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
      </tbody>
    </table>
  );
}
