'use strict';

function expand(grammar, production, symbol) {

  const productions = grammar.calculate("grammar.productions");
  
  let changes = [];
  
  // Remove the existing production
  
  changes.push({ operation: "delete", index: production });
  
  // Add new productions
  
  let offset = 0;

  for (let i = 0; i < productions.length; i++) {
  
    if (productions[i][0] === productions[production][symbol]) {
    
      let p = productions[production].slice();
      let b = productions[i].slice(1);
      Array.prototype.splice.apply(p, [symbol, 1].concat(b));
      
      changes.push({ production: p, operation: "insert", index: production + offset });
      offset++;
    
    }
  
  }

  return changes;
  
}

module.exports["transformations.expand"] = function(grammar) {

  const nonterminals = grammar.calculate("grammar.nonterminals");
  const productions = grammar.calculate("grammar.productions");
  
  let result = [];

  // Are there any nonterminals we can expand?

  for (let i = 0; i < productions.length; i++) {
    for (let j = 1; j < productions[i].length; j++) {
    
      if (nonterminals[productions[i][j]]) {
      
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
