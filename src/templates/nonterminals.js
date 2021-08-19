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
        let firstSymbols = first[symbol] ? new Set(Object.keys(first[symbol])) : new Set();
        let followSymbols = follow[symbol] ? new Set(Object.keys(follow[symbol])) : new Set();

        return m("tr",
          m("td", Helpers.formatSymbol(symbol, info)),
          m("td", nullable.has(symbol) ? "Nullable" : ""),
          m("td", endable.has(symbol) ? "Endable" : ""),
          m("td", Helpers.formatSymbolList(Helpers.listSymbols(firstSymbols, info.terminalOrder), info)),
          m("td", Helpers.formatSymbolList(Helpers.listSymbols(followSymbols, info.terminalOrder), info))
        );
      })
    )
  ];
}
