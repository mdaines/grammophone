const m = require("mithril");

const MDASH = "\u2014";

function formatClassification(cs, c, n) {
  if (cs[c].member) {
    return ["The grammar is ", n, "."];
  } else {
    return m("span", { className: "conflict" }, "Not ", n, " ", MDASH, " ", cs[c].reason, ".");
  }
}

module.exports = function(input) {
  let classification = input.classification;

  return [
    m("h1", "Parsing Algorithms"),
    m("table.parsing-algorithm-table",
      m("tr",
        m("th", { scope: "row" }, "LL(1)"),
        m("td.classification", formatClassification(classification, "ll1", "LL(1)")),
        m("td",
          m("a", { href: "#/ll1-table" }, "Parsing table")
        )
      ),
      m("tr",
        m("th", { scope: "row" }, "LR(0)"),
        m("td.classification", formatClassification(classification, "lr0", "LR(0)")),
        m("td",
          m("a", { href: "#/lr0-automaton" }, "Automaton"),
          ", ",
          m("a", { href: "#/lr0-table" }, "Parsing table")
        )
      ),
      m("tr",
        m("th", { scope: "row" }, "SLR(1)"),
        m("td.classification", formatClassification(classification, "slr1", "SLR(1)")),
        m("td",
          m("a", { href: "#/slr1-table" }, "Parsing table")
        )
      ),
      m("tr",
        m("th", { scope: "row" }, "LR(1)"),
        m("td.classification", formatClassification(classification, "lr1", "LR(1)")),
        m("td",
          m("a", { href: "#/lr1-automaton" }, "Automaton"),
          ", ",
          m("a", { href: "#/lr1-table" }, "Parsing table")
        )
      ),
      m("tr",
        m("th", { scope: "row" }, "LALR(1)"),
        m("td.classification", formatClassification(classification, "lalr1", "LALR(1)")),
        m("td",
          m("a", { href: "#/lalr1-automaton" }, "Automaton"),
          ", ",
          m("a", { href: "#/lalr1-table" }, "Parsing table")
        )
      )
    )
  ];
}
