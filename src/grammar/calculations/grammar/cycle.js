'use strict';

const Relations = require('../../../relations');

module.exports["grammar.cycle"] = function(grammar) {

  const nonterminals = grammar.calculate("grammar.nonterminals");
  const nullable = grammar.calculate("grammar.nullable");
  const productions = grammar.calculate("grammar.productions");

  // Build relation
  // (x,y) | x -> a y b, y a nonterminal, a and b nullable

  let relation = Relations.create();

  for (let i = 0; i < productions.length; i++) {
    for (let j = 1; j < productions[i].length; j++) {
    
      if (nonterminals[productions[i][j]]) {
        
        let k;
      
        for (k = 1; k < productions[i].length; k++) {
        
          if (j === k) {
            continue;
          }
        
          if (!nonterminals[productions[i][k]] || !nullable[productions[i][k]]) {
            break;
          }
        
        }
      
        if (k === productions[i].length) {
          Relations.add(relation, productions[i][0], productions[i][j]);
        }
      
      }
    
    }
  }

  // Find a cycle if there is one

  return Relations.cycle(relation);

};
