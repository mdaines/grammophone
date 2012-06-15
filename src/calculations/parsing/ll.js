Calculations["parsing.ll.ll1_table"] = function(grammar) {
  
  var i, k, l, s;
  var table = {};
  var first;
  
  var terminals = grammar.calculate("grammar.terminals");
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var follow = grammar.calculate("grammar.follow");
  
  // Populate table with blank arrays
  
  for (k in nonterminals) {
    
    table[k] = {};
    
    for (l in terminals)
      table[k][l] = [];
    
    table[k][Grammar.END] = [];
    
  }
  
  // Collect moves
  
  for (i = 0; i < grammar.productions.length; i++) {
    
    head = grammar.productions[i][0];
    body = grammar.productions[i].slice(1);
    
    // Get the first set of the production's body
    
    first = grammar.getFirst(body);
  
    // For each symbol s in first(body), add the production
    // to table[nonterminal][s].
  
    for (s in first)
      table[head][s].push(i);
    
    // If the body is nullable, for each symbol s of follow(head),
    // add this production to table[head][s].
      
    if (grammar.isNullable(body)) {
      
      for (s in follow[head])
        table[head][s].push(i);
      
    }
    
  }
  
  return table;
  
};
