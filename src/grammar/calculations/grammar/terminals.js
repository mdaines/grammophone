'use strict';

module.exports["grammar.terminals"] = function(grammar) {

  let terminals = {};
  const nonterminals = grammar.calculate("grammar.nonterminals");

  for (let i = 0; i < grammar.productions.length; i++) {
    for (let j = 1; j < grammar.productions[i].length; j++) {
  
      if (!nonterminals[grammar.productions[i][j]]) {
        terminals[grammar.productions[i][j]] = true;
      }
    
    }
  }

  return terminals;

};
