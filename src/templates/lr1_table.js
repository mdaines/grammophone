const m = require("mithril/hyperscript");
const END = require("../grammar/symbols").END;
const Helpers = require("../helpers");

module.exports = function(input) {
  let info = input.info;
  let table = input.table;
  let productions = input.productions;

  return m("table.symbols.lr1-table",
    m("colgroup",
      m("col")
    ),
    m("colgroup.t",
      Helpers.fillArray(info.terminals.size + 1, m("col"))
    ),
    m("colgroup.nt",
      Helpers.fillArray(info.nonterminals.size, m("col"))
    ),

    m("tr",
      m("th", "State"),
      info.terminalOrder.map(function(symbol) {
        return m("th", Helpers.formatSymbol(symbol, info));
      }),
      m("th", Helpers.formatSymbol(END, info)),
      info.nonterminalOrder.map(function(symbol) {
        return m("th", Helpers.formatSymbol(symbol, info));
      })
    ),

    Object.keys(table).map(function(s, index) {
      let state = table[s];

      return m("tr",
        m("th", { scope: "row" }, index),
        info.terminalOrder.concat(END).map(function(s) {
          if (typeof state[s] === "undefined") {
            return m("td");
          } else {
            let actions = [];

            if (typeof state[s].shift !== "undefined") {
              actions.push(m("li", "shift(", state[s].shift, ")"));
            }

            if (typeof state[s].reduce !== "undefined") {
              state[s].reduce.forEach(function(p) {
                if (p === -1) {
                  actions.push(m("li", "accept"));
                } else {
                  actions.push(m("li", "reduce(", Helpers.formatProduction(productions[p], info), ")"));
                }
              });
            }

            let isConflict = (typeof state[s].shift === "undefined" ? 0 : 1) + (typeof state[s].reduce !== "undefined" ? state[s].reduce.length : 0) > 1;

            return m("td", { className: isConflict ? "conflict" : "" },
              m("ul", actions)
            );
          }
        }),
        info.nonterminalOrder.map(function(s) {
          if (typeof state[s] === "undefined") {
            return m("td");
          } else if (typeof state[s].shift === "undefined") {
            return m("td",
              m("ul")
            );
          } else {
            return m("td",
              m("ul",
                m("li", state[s].shift)
              )
            );
          }
        })
      );
    })
  );
}
