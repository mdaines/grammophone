'use strict';

const Relations = require('../../../relations');
const END = require('../../symbols').END;

module.exports["grammar.follow"] = function(grammar) {

  let immediate, propagation, result;
  const first = grammar.calculate("grammar.first");
  const nullable = grammar.calculate("grammar.nullable");
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const start = grammar.calculate("grammar.start");

  immediate = Relations.create();
  propagation = Relations.create();

  // Add the end of input symbol to the immediate follow set of the grammar's start symbol.

  Relations.add(immediate, start, END);

  // Given a production X -> ... A β, follow(A) includes first(β), except for the empty string.

  for (let i = 0; i < grammar.productions.length; i++) {

    for (let j = 1; j < grammar.productions[i].length - 1; j++) {
  
      // If the symbol is a nonterminal...
  
      if (nonterminals[grammar.productions[i][j]]) {
    
        // Add the first set of the remaining symbols to the follow set of the symbol
    
        for (let k = j + 1; k < grammar.productions[i].length; k++) {
      
          // If this symbol is a terminal, add it, and then stop adding.
      
          if (!nonterminals[grammar.productions[i][k]]) {
            Relations.add(immediate, grammar.productions[i][j], grammar.productions[i][k]);
            break;
          }
      
          // If it is a nonterminal, add the first set of that nonterminal.
    
          for (let s in first[grammar.productions[i][k]]) {
            Relations.add(immediate, grammar.productions[i][j], s);
          }
        
          // Stop if it isn't nullable.
      
          if (!nullable[grammar.productions[i][k]]) {
            break;
          }
        
        }
    
      }
  
    }

  }

  // Given a production B -> ... A β where β is nullable or is the empty string, follow(A) includes follow(B)

  for (let i = 0; i < grammar.productions.length; i++) {

    // Scan from the end of the right side of the production to the beginning...

    for (let j = grammar.productions[i].length - 1; j > 0; j--) {
  
      // If the symbol is a nonterminal, add the left side.
  
      if (nonterminals[grammar.productions[i][j]]) {
        Relations.add(propagation, grammar.productions[i][j], grammar.productions[i][0]);
      }
    
      // If it isn't nullable, stop.
  
      if (!nullable[grammar.productions[i][j]]) {
        break;
      }
  
    }

  }

  // Propagate the relation

  result = Relations.propagate(immediate, propagation);
  
  // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.
  
  for (let k in nonterminals) {
    if (typeof result[k] === "undefined") {
      result[k] = {};
    }
  }
  
  return result;

};
