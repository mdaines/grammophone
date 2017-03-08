'use strict';

function expand(grammar, production, symbol) {
  
  let changes = [];
  
  // Remove the existing production
  
  changes.push({ operation: "delete", index: production });
  
  // Add new productions
  
  let offset = 0;

  for (let i = 0; i < grammar.productions.length; i++) {
  
    if (grammar.productions[i][0] === grammar.productions[production][symbol]) {
    
      let p = grammar.productions[production].slice();
      let b = grammar.productions[i].slice(1);
      Array.prototype.splice.apply(p, [symbol, 1].concat(b));
      
      changes.push({ production: p, operation: "insert", index: production + offset });
      offset++;
    
    }
  
  }

  return changes;
  
}

module.exports["transformations.expand"] = function(grammar) {

  const nonterminals = grammar.calculate("grammar.nonterminals");
  let result = [];

  // Are there any nonterminals we can expand?

  for (let i = 0; i < grammar.productions.length; i++) {
    for (let j = 1; j < grammar.productions[i].length; j++) {
    
      if (nonterminals[grammar.productions[i][j]]) {
      
        result.push({
          name: "expand",
          production: i,
          symbol: j,
          changes: expand(grammar, i, j)
        });
      
      }
    
    }
  }

  return result;

};
