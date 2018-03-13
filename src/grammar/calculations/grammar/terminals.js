'use strict';

module.exports["grammar.terminals"] = function(grammar) {

  let terminals = {};
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const productions = grammar.calculate("grammar.productions");

  for (let i = 0; i < productions.length; i++) {
    for (let j = 1; j < productions[i].length; j++) {

      if (!nonterminals[productions[i][j]]) {
        terminals[productions[i][j]] = true;
      }

    }
  }

  return terminals;

};
