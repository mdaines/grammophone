'use strict';

function removeImmediateLeftRecursion(grammar, base, recursive) {
  
  const nonterminals = grammar.calculate("grammar.nonterminals");

  // Find a new symbol for the right recursive production by adding primes
  // to the existing symbol.

  let symbol = grammar.productions[recursive[0]][0];

  do {
    symbol += "'";
  } while (typeof nonterminals[symbol] !== "undefined");

  // Copy productions to changes, marking those we're removing.

  let changes = [];
  let first;
  let offset = 0;

  for (let i = 0; i < grammar.productions.length; i++) {
  
    if (base.indexOf(i) !== -1 || recursive.indexOf(i) !== -1) {
      
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
      
      if (typeof first === "undefined") {
        first = i;
      }
    }
  
  }

  // Create the new productions...
  
  offset = 0;

  // Base rules

  for (let i = 0; i < base.length; i++) {
  
    let production = [];
  
    for (let j = 0; j < grammar.productions[base[i]].length; j++) {
      production.push(grammar.productions[base[i]][j]);
    }
    
    production.push(symbol);
  
    changes.push({ production: production, operation: "insert", index: first + offset });
    offset++;
  
  }

  // Recursive rules

  for (let i = 0; i < recursive.length; i++) {
  
    let production = [];
  
    production.push(symbol);
  
    for (let j = 2; j < grammar.productions[recursive[i]].length; j++) {
      production.push(grammar.productions[recursive[i]][j]);
    }
  
    production.push(symbol);
  
    changes.push({ production: production, operation: "insert", index: first + offset });
    offset++;
  
  }

  // Epsilon

  changes.push({ production: [symbol], operation: "insert", index: first + offset });

  return changes;
  
}

module.exports["transformations.removeImmediateLeftRecursion"] = function(grammar) {
 
  const nonterminals = grammar.calculate("grammar.nonterminals");
  let result = [];
  
  let candidates = {};
  
  // Are there any rules of this form...
  //
  //   A -> A a_1 | A a_2 | ... | A a_m | b_1 | ... | b_n
  //
  // where m, n > 0?
  
  for (let nt in nonterminals) {
    candidates[nt] = { recursive: [], base: [] };
  }
  
  for (let i = 0; i < grammar.productions.length; i++) {
    let nt = grammar.productions[i][0];
  
    if (nt === grammar.productions[i][1]) {
      candidates[nt].recursive.push(i);
    } else {
      candidates[nt].base.push(i);
    }
  }
  
  for (let nt in candidates) {
  
    if (candidates[nt].recursive.length > 0 && candidates[nt].base.length > 0) {
    
      result.push({
        name: "removeImmediateLeftRecursion",
        production: candidates[nt].recursive[0],
        symbol: 0,
        changes: removeImmediateLeftRecursion(grammar, candidates[nt].base, candidates[nt].recursive)
      });
    
    }
  
  }
 
  return result;
 
};
