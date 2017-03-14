'use strict';

function epsilonSeparate(grammar, group, epsilon) {
  
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const productions = grammar.calculate("grammar.productions");

  // Find a new symbol...

  let symbol = productions[group[0]][0];

  do {
    symbol += "*";
  } while (typeof nonterminals[symbol] !== "undefined");

  // Copy productions to changes, marking those we're removing.

  let changes = [];
  let offset = 0;

  for (let i = 0; i < productions.length; i++) {
  
    if (group.indexOf(i) !== -1 || i === epsilon) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }
  
  }
  
  // Add the separated version of the original rule

  changes.push({
    production: [productions[group[0]][0], symbol],
    operation: "insert",
    index: group[0]
  });

  changes.push({
    production: [productions[group[0]][0]],
    operation: "insert",
    index: group[0] + 1
  });
  
  // Add the non-epsilon production bodies with the new head

  for (let i = 0; i < group.length; i++) {
    changes.push({
      production: [symbol].concat(productions[group[i]].slice(1)),
      operation: "insert",
      index: group[0] + i + 2
    });
  }
  
  return changes;
  
}

module.exports["transformations.epsilonSeparate"] = function(grammar) {
  
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const productions = grammar.calculate("grammar.productions");
  let result = [];
  
  // For each nonterminal, determine if it is unambiguously nullable,
  // while collecting its non-null productions and its null (epsilon)
  // production. If it is unambiguously nullable, add it to the result.
  
  for (let nt in nonterminals) {
    
    let group = [];
    let epsilon = -1;
    let i;
    
    for (i = 0; i < productions.length; i++) {
      
      if (productions[i][0] === nt) {
      
        if (productions[i].length === 1) {
          if (epsilon !== -1) {
            break;
          }
          epsilon = i;
        } else {
          group.push(i);
        }
        
      }
      
    }
    
    if (i === productions.length && epsilon !== -1) {
      
      result.push({
        name: "epsilonSeparate",
        production: group[0],
        symbol: 0,
        changes: epsilonSeparate(grammar, group, epsilon)
      });
      
    }
    
  }
  
  return result;
  
};
