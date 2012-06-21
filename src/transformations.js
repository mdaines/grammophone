var Transformations = {};

Transformations["expand"] = function(grammar, options) {
  
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var productions = grammar.copyProductions();
  
  // Attempting to expand a symbol that is not a nonterminal
  // is an error.
  
  if (!nonterminals[grammar.productions[options.production][options.symbol]])
    throw "Attempted to expand a symbol that is not a nonterminal.";
  
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

Transformations["removeImmediateLeftRecursion"] = function(grammar, options) {
  
  var i, j;
  var nonterminals = grammar.calculate("grammar.nonterminals");
  
  // Find a new symbol for the right recursive production by adding primes
  // to the existing symbol.
  
  var symbol = grammar.productions[options.recursive[0]][0];
  
  do {
    symbol += "'";
  } while (typeof nonterminals[symbol] !== "undefined");
  
  // Copy unrelated productions into the grammar.
  
  var productions = [];
  
  for (i = 0; i < grammar.productions.length; i++) {
    
    if (options.base.indexOf(i) === -1 && options.recursive.indexOf(i) === -1) {
      
      var production = [];
      
      for (j = 0; j < grammar.productions[i].length; j++)
        production.push(grammar.productions[i][j]);
      
      productions.push(production);
      
    }
    
  }
  
  // Create the new productions...
  
  // Base rules
  
  var replacement = [];
  
  for (i = 0; i < options.base.length; i++) {
    
    var production = [];
    
    for (j = 0; j < grammar.productions[options.base[i]].length; j++)
      production.push(grammar.productions[options.base[i]][j]);
      
    production.push(symbol);
    
    replacement.push(production);
    
  }
  
  // Recursive rules
  
  for (i = 0; i < options.recursive.length; i++) {
    
    var production = [];
    
    production.push(symbol);
    
    for (j = 2; j < grammar.productions[options.recursive[i]].length; j++)
      production.push(grammar.productions[options.recursive[i]][j]);
    
    production.push(symbol);
    
    replacement.push(production);
    
  }
  
  replacement.push([symbol]);
  
  // Put replacement into new list of productions and return
  // resulting grammar.
  
  productions = productions.slice(0, options.recursive[0]).concat(replacement).concat(productions.slice(options.recursive[0]));
  
  return new Grammar(productions);
  
}
