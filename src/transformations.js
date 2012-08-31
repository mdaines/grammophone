var Transformations = {};

// Transformations return an array of changes, which look like:
//
//   { production: ["A", "x"], change: "added" }
//   { production: ["A", "y"], change: "removed" }
//
// The change member may be absent, indicating that no change was made.

Transformations["expand"] = function(grammar, options) {
  
  var changes = [];
  
  // What symbol are we looking for?
  
  var symbol = grammar.productions[options.production][options.symbol];
  
  // Copy the productions to the changes, marking the production with the
  // symbol we're expanding.
  
  for (i = 0; i < grammar.productions.length; i++) {
    
    if (i === options.production)
      changes[i] = { production: grammar.productions[i].slice(), change: "removed" };
    else
      changes[i] = { production: grammar.productions[i].slice() };
    
  }
  
  // For each production in the grammar with the desired symbol as the head,
  // add an "added" change with the body of that production replacing the
  // symbol in the desired production.
  
  for (i = 0; i < grammar.productions.length; i++) {
    
    if (grammar.productions[i][0] === symbol) {
      
      var production = grammar.productions[options.production].slice();
      var body = grammar.productions[i].slice(1);
      Array.prototype.splice.apply(production, [options.symbol, 1].concat(body));
      
      changes.splice(options.production + 1, 0, { production: production, change: "added" });
      
    }
    
  }
  
  return changes;
  
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

Transformations["leftFactor"] = function(grammar, options) {
  
  var i, j;
  var nonterminals = grammar.calculate("grammar.nonterminals");
  
  // Find a new symbol...
  
  var symbol = grammar.productions[options.production][0];
  
  do {
    symbol += "'";
  } while (typeof nonterminals[symbol] !== "undefined");
  
  // Copy unrelated productions into the grammar.
  
  var productions = [];
  
  for (i = 0; i < grammar.productions.length; i++) {
    
    if (options.productions.indexOf(i) === -1) {
      
      var production = [];
      
      for (j = 0; j < grammar.productions[i].length; j++)
        production.push(grammar.productions[i][j]);
      
      productions.push(production);
      
    }
    
  }
  
  var replacement = [];
  
  // Add the reference to the new symbol with the factored prefix
  
  replacement.push(grammar.productions[options.productions[0]].slice(0, options.prefix).concat(symbol));
  
  // Add the productions in the group
  
  for (i = 0; i < options.productions.length; i++) {
    replacement.push([symbol].concat(grammar.productions[options.productions[i]].slice(options.prefix)));
  }
  
  // Put replacement into new list of productions and return
  // resulting grammar.
  
  productions = productions.slice(0, options.productions[0]).concat(replacement).concat(productions.slice(options.productions[0]));
  
  return new Grammar(productions);
  
}
