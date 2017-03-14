'use strict';

const Relations = require('../../../relations');

module.exports["grammar.unreachable"] = function(grammar) {
  
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const start = grammar.calculate("grammar.start");
  const productions = grammar.calculate("grammar.productions");

  // Build relation:
  // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

  let relation = Relations.create();

  for (let i = 0; i < productions.length; i++) {
    for (let j = 1; j < productions[i].length; j++) {
    
      if (nonterminals[productions[i][j]]) {
        Relations.add(relation, productions[i][0], productions[i][j]);
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
