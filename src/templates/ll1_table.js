const m = require("mithril/hyperscript");
const END = require("../grammar/symbols").END;
const Helpers = require("../helpers");

module.exports = function(input) {
  let info = input.info;
  let table = input.table;
  let productions = input.productions;

  return m("table.symbols.ll1-table",
    m("colgroup",
      m("col")
    ),
    m("colgroup.t",
      Helpers.fillArray(info.terminals.size + 1, m("col"))
    ),

    m("tr",
      m("th"),
      info.terminalOrder.map(function(symbol) {
        return m("th", Helpers.formatSymbol(symbol, info));
      }),
      m("th", Helpers.formatSymbol(END, info))
    ),

    info.productionOrder.map(function(nt) {
      return m("tr",
        m("th", { scope: "row" }, Helpers.formatSymbol(nt, info)),
        info.terminalOrder.concat(END).map(function(t) {
          if (typeof table[nt][t] !== "undefined") {
            return m("td", { className: table[nt][t].length > 1 ? "conflict" : "" },
              m("ul",
                table[nt][t].map(function(p) {
                  return m("li", Helpers.formatProduction(productions[p], info));
                })
              )
            );
          } else {
            return m("td");
          }
        })
      );
    })
  );
}
