const m = require("mithril");
const Sets = require("../sets");
const Helpers = require("../helpers");

module.exports = function(input) {
  let info = input.info;
  let table = input.table;
  let productions = input.productions;

  return m("table.symbols.lr0-table",
    m("colgroup",
      m("col")
    ),
    m("colgroup.t",
      Helpers.fillArray(Sets.count(info.terminals), m("col"))
    ),
    m("colgroup.nt",
      Helpers.fillArray(Sets.count(info.nonterminals), m("col"))
    ),

    m("tr",
      m("th", "State"),
      info.terminalOrder.map(function(symbol) {
        return m("th", Helpers.formatSymbol(symbol, info));
      }),
      info.nonterminalOrder.map(function(symbol) {
        return m("th", Helpers.formatSymbol(symbol, info));
      })
    ),

    Object.keys(table).map(function(s, index) {
      let state = table[s];

      return m("tr",
        m("th", { scope: "row" }, index),
        info.terminalOrder.map(function(s) {
          let actions = [];

          if (typeof state.shift[s] !== "undefined") {
            actions.push(m("li", "shift(", state.shift[s], ")"));
          }

          state.reduce.forEach(function(p) {
            if (p === -1) {
              actions.push(m("li", "accept"));
            } else {
              actions.push(m("li", "reduce(", Helpers.formatProduction(productions[p], info), ")"));
            }
          });

          let isConflict = (typeof state.shift[s] === "undefined" ? 0 : 1) + state.reduce.length > 1;

          return m("td", { className: isConflict ? "conflict" : "" },
            m("ul", actions)
          );
        }),

        info.nonterminalOrder.map(function(s) {
          return m("td",
            m("ul", typeof state.shift[s] !== "undefined" ? m("li", state.shift[s]) : [])
          );
        })
      );
    })
  );
}
