'use strict';

module.exports["grammar.nonterminals"] = function(grammar) {

  let nonterminals = {};

  for (let i = 0; i < grammar.productions.length; i++) {
    nonterminals[grammar.productions[i][0]] = true;
  }

  return nonterminals;

};
