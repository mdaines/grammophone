const m = require("mithril/hyperscript");
const Helpers = require("../helpers");
const Sets = require("../sets");

function formatUnreachable(unreachable, info) {
  if (Sets.any(unreachable)) {
    return m("li",
      "The grammar has unreachable nonterminals: ",
      Helpers.formatSymbolList(Helpers.listSymbols(unreachable, info.productionOrder), info)
    );
  } else {
    return m("li", "All nonterminals are reachable.");
  }
}

function formatUnrealizable(unrealizable, info) {
  if (Sets.any(unrealizable)) {
    return m("li",
      "The grammar has unrealizable nonterminals: ",
      Helpers.formatSymbolList(Helpers.listSymbols(unrealizable, info.productionOrder), info)
    );
  } else {
    return m("li", "All nonterminals are realizable.");
  }
}

function formatCycle(cycle, info) {
  if (typeof cycle !== "undefined") {
    return m("li",
      "The grammar is cyclic: ",
      Helpers.formatSymbolList(cycle, info, " \u21D2 "),
      " is a cycle."
    );
  } else {
    return m("li", "The grammar contains no cycles.");
  }
}

function formatNullAmbiguity(nullAmbiguity, productions, info) {
  if (nullAmbiguity.length > 0) {
    return m("li",
      "The grammar contains a null ambiguity: ",
      Helpers.formatProduction(productions[nullAmbiguity[0]], info),
      " and ",
      Helpers.formatProduction(productions[nullAmbiguity[1]], info),
      " are ambiguously nullable."
    );
  } else {
    return m("li", "The grammar is null unambiguous.");
  }
}

function formatAmbiguous(ambiguous, info) {
  if (typeof ambiguous !== "undefined") {
    return m("li",
      "The grammar is ambiguous: the sentence ",
      Helpers.formatSentence(ambiguous, info),
      " has an ambiguous derivation."
    );
  }
}

module.exports = function(input) {
  let unreachable = input.unreachable;
  let unrealizable = input.unrealizable;
  let cycle = input.cycle;
  let nullAmbiguity = input.nullAmbiguity;
  let ambiguous = input.ambiguous;
  let productions = input.productions;
  let info = input.info;

  return [
    m("h1", "Sanity Checks"),
    m("ul.symbols",
      formatUnreachable(unreachable, info),
      formatUnrealizable(unrealizable, info),
      formatCycle(cycle, info),
      formatNullAmbiguity(nullAmbiguity, productions, info),
      formatAmbiguous(ambiguous, info)
    )
  ];
}
