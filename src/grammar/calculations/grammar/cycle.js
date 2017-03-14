'use strict';

const Relations = require('../../../relations');

module.exports["grammar.cycle"] = function(grammar) {

  const nonterminals = grammar.calculate("grammar.nonterminals");
  const nullable = grammar.calculate("grammar.nullable");

  // Build relation
  // (x,y) | x -> a y b, y a nonterminal, a and b nullable

  let relation = Relations.create();

  for (let i = 0; i < grammar.productions.length; i++) {
    for (let j = 1; j < grammar.productions[i].length; j++) {
    
      if (nonterminals[grammar.productions[i][j]]) {
        
        let k;
      
        for (k = 1; k < grammar.productions[i].length; k++) {
        
          if (j === k) {
            continue;
          }
        
          if (!nonterminals[grammar.productions[i][k]] || !nullable[grammar.productions[i][k]]) {
            break;
          }
        
        }
      
        if (k === grammar.productions[i].length) {
          Relations.add(relation, grammar.productions[i][0], grammar.productions[i][j]);
        }
      
      }
    
    }
  }

  // Find a cycle if there is one

  return Relations.cycle(relation);

};
