var Transformations = {};

Transformations["expand"] = function(grammar, options) {
  
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var productions = grammar.copyProductions();
  
  // Attempting to expand a symbol that is not a nonterminal
  // should have no effect.
  
  if (!nonterminals[grammar.productions[options.production][options.symbol]])
    return new Grammar(productions);
  
  // Remove the production with the terminal we want to expand.
  
  var production = productions.splice(options.production, 1)[0];
  
  // What symbol are we looking for?
  
  var symbol = production[options.symbol];
  
  // For each production in the grammar with this symbol as the head,
  // add a new production with the body replacing the symbol.
  
  var count = 0;
  
  for (i = 0; i < grammar.productions.length; i++) {
    
    if (grammar.productions[i][0] === symbol) {
      
      var expanded = [];
      
      for (j = 0; j < production.length; j++) {
        
        if (j === options.symbol) {
          for (k = 1; k < grammar.productions[i].length; k++)
            expanded.push(grammar.productions[i][k]);
        } else {
          expanded.push(production[j]);
        }
        
      }
      
      productions.splice(options.production + count, 0, expanded);
      count++;
      
    }
    
  }
  
  // Return a new grammar.
  
  return new Grammar(productions);
  
}
