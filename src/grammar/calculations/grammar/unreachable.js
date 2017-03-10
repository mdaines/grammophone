'use strict';

const Relations = require('../../../relations');

module.exports["grammar.unreachable"] = function(grammar) {
  
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const start = grammar.calculate("grammar.start");

  // Build relation:
  // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

  let relation = Relations.create();

  for (let i = 0; i < grammar.productions.length; i++) {
    for (let j = 1; j < grammar.productions[i].length; j++) {
    
      if (nonterminals[grammar.productions[i][j]]) {
        Relations.add(relation, grammar.productions[i][0], grammar.productions[i][j]);
      }
    
    }
  }

  // Obtain the closure of the relation

  let closure = Relations.closure(relation);

  // Collect unreachable nonterminals

  let unreachable = {};

  for (let s in nonterminals) {
  
    if (s !== start && (!closure[start] || !closure[start][s])) {
      unreachable[s] = true;
    }
    
  }

  return unreachable;

};
