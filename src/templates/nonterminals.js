const m = require("mithril/hyperscript");
const Helpers = require("../helpers");

module.exports = function(input) {
  let nullable = input.nullable;
  let endable = input.endable;
  let first = input.first;
  let follow = input.follow;
  let info = input.info;

  return [
    m("h1", "Nonterminals"),

    m("table.symbols",
      m("tr",
        m("th", "Symbol"),
        m("th", "Nullable?"),
        m("th", "Endable?"),
        m("th", "First set"),
        m("th", "Follow set")
      ),

      info.productionOrder.map(function(symbol) {
        return m("tr",
          m("td", Helpers.formatSymbol(symbol, info)),
          m("td", nullable[symbol] ? "Nullable" : ""),
          m("td", endable[symbol] ? "Endable" : ""),
          m("td", Helpers.formatSymbolList(Helpers.listSymbols(first[symbol] || {}, info.terminalOrder), info)),
          m("td", Helpers.formatSymbolList(Helpers.listSymbols(follow[symbol] || {}, info.terminalOrder), info))
        );
      })
    )
  ];
}
