Calculations["grammar.nonterminals"] = function(grammar) {
  
  var i;
  var nonterminals = {};

  for (i = 0; i < grammar.productions.length; i++)
    nonterminals[grammar.productions[i][0]] = true;

  return nonterminals;
  
}

Calculations["grammar.terminals"] = function(grammar) {
  
  var i, j;
  var terminals = {};
  var nonterminals = grammar.calculate("grammar.nonterminals");

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {
    
      if (!nonterminals[grammar.productions[i][j]])
        terminals[grammar.productions[i][j]] = true;
      
    }
  }

  return terminals;
  
}

Calculations["grammar.symbol_info"] = function(grammar) {
  
  var i, j, s;
  
  var order = [];
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var terminals = grammar.calculate("grammar.terminals");

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 0; j < grammar.productions[i].length; j++) {
      
      if (order.indexOf(grammar.productions[i][j]) === -1)
        order.push(grammar.productions[i][j]);
      
    }
  }
  
  return {
    order: order,
    nonterminals: nonterminals,
    terminals: terminals
  };
  
}

Calculations["grammar.start"] = function(grammar) {
  
  return grammar.productions[0][0];
  
}

Calculations["grammar.productions"] = function(grammar) {
  
  return grammar.productions;
  
}

Calculations["grammar.unreachable"] = function(grammar) {
    
  var relation, closure, unreachable;
  var i, j, s;
  
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var start = grammar.calculate("grammar.start");
  
  // Build relation:
  // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals
  
  relation = Relation.create();
  
  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {
      
      if (nonterminals[grammar.productions[i][j]])
        Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);
      
    }
  }
  
  // Obtain the closure of the relation
  
  closure = Relation.closure(relation);
  
  // Collect unreachable nonterminals
  
  unreachable = {};
  
  for (s in nonterminals) {
    
    if (s != start && (!closure[start] || !closure[start][s]))
      unreachable[s] = true;
      
  }
  
  return unreachable;
  
}

Calculations["grammar.unrealizable"] = function(grammar) {
  
  var marked, added, unrealizable;
  var i, j, s;
  var nonterminals = grammar.calculate("grammar.nonterminals");
  
  // Is a particular nonterminal realizable?
  
  marked = {};
  
  do {
    
    added = [];
    
    for (i = 0; i < grammar.productions.length; i++) {
      
      // Are there any unmarked nonterminals? Break at the first one.
      
      for (j = 1; j < grammar.productions[i].length; j++) {
        
        if (!marked[grammar.productions[i][j]] && nonterminals[grammar.productions[i][j]])
          break;
        
      }
      
      // If the head of this production is not marked, and all of the symbols in
      // the body of the production were not unmarked nonterminals (ie, they were
      // either marked or terminals), mark the head and record
      // that we marked it in this step.
    
      if (!marked[grammar.productions[i][0]] && j == grammar.productions[i].length) {
        marked[grammar.productions[i][0]] = true;
        added.push(grammar.productions[i][0]);
      }
      
    }
    
  } while (added.length > 0);
  
  // Collect nonterminals which were not marked.
  
  unrealizable = {};
  
  for (s in nonterminals) {
    
    if (!marked[s])
      unrealizable[s] = true;
      
  }
  
  return unrealizable;
  
}

Calculations["grammar.cycle"] = function(grammar) {
  
  var relation;
  var i, j, k;
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var nullable = grammar.calculate("grammar.nullable");
  
  // Build relation
  // (x,y) | x -> a y b, y a nonterminal, a and b nullable
  
  relation = Relation.create();
  
  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {
      
      if (nonterminals[grammar.productions[i][j]]) {
        
        for (k = 1; k < grammar.productions[i].length; k++) {
          
          if (j === k)
            continue;
          
          if (!nonterminals[grammar.productions[i][k]] || !nullable[grammar.productions[i][k]])
            break;
          
        }
        
        if (k === grammar.productions[i].length)
          Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);
        
      }
      
    }
  }
  
  // Find a cycle if there is one
  
  return Relation.cycle(relation);
  
}

Calculations["grammar.nullable"] = function(grammar) {
  
  var nullable = {};
  var added;
  var i, j, head;

  do {

    added = [];

    for (i = 0; i < grammar.productions.length; i++) {
  
      for (j = 1; j < grammar.productions[i].length; j++) {
        if (!nullable[grammar.productions[i][j]])
          break;
      }
  
      head = grammar.productions[i][0];
  
      if (j == grammar.productions[i].length && !nullable[head]) {
        nullable[head] = true;
        added.push(head);
      }
  
    }

  } while (added.length > 0);

  return nullable;
  
}

Calculations["grammar.first"] = function(grammar) {
  
  var immediate, propagation;
  var i, j;
  var nullable = grammar.calculate("grammar.nullable");
  var nonterminals = grammar.calculate("grammar.nonterminals");

  immediate = Relation.create();
  propagation = Relation.create();

  // For each production, add the first terminal symbol after a sequence of nullable symbols.

  for (i = 0; i < grammar.productions.length; i++) {
  
    // Skip nullable symbols...
  
    for (j = 1; j < grammar.productions[i].length; j++) {
    
      if (!nullable[grammar.productions[i][j]])
        break;
    
    }
  
    // If the first non-nullable symbol is a terminal, add it to the immediate first set
    // of this nonterminal.
  
    if (j < grammar.productions[i].length && !nonterminals[grammar.productions[i][j]])
      Relation.add(immediate, grammar.productions[i][0], grammar.productions[i][j]);

  }

  // For each production, add the prefix of nullable nonterminals, and then the next symbol
  // if it is also a nonterminal.

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {
    
      // Is it a nonterminal? Add it.
    
      if (nonterminals[grammar.productions[i][j]])
        Relation.add(propagation, grammar.productions[i][0], grammar.productions[i][j]);
    
      // Is it not nullable? Stop.
    
      if (!nullable[grammar.productions[i][j]])
        break;
    
    }
  }

  // Propagate the relation.

  return Relation.propagate(immediate, propagation);
  
}

Calculations["grammar.follow"] = function(grammar) {
  
  var immediate, propagation;
  var i, j, k, s;
  var first = grammar.calculate("grammar.first");
  var nullable = grammar.calculate("grammar.nullable");
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var start = grammar.calculate("grammar.start");

  immediate = Relation.create();
  propagation = Relation.create();

  // Add the end of input symbol to the immediate follow set of the grammar's start symbol.

  Relation.add(immediate, start, Grammar.END);

  // Given a production X -> ... A β, follow(A) includes first(β), except for the empty string.

  for (i = 0; i < grammar.productions.length; i++) {
  
    for (j = 1; j < grammar.productions[i].length - 1; j++) {
    
      // If the symbol is a nonterminal...
    
      if (nonterminals[grammar.productions[i][j]]) {
      
        // Add the first set of the remaining symbols to the follow set of the symbol
      
        for (k = j + 1; k < grammar.productions[i].length; k++) {
        
          // If this symbol is a terminal, add it, and then stop adding.
        
          if (!nonterminals[grammar.productions[i][k]]) {
            Relation.add(immediate, grammar.productions[i][j], grammar.productions[i][k]);
            break;
          }
        
          // If it is a nonterminal, add the first set of that nonterminal.
      
          for (s in first[grammar.productions[i][k]])
            Relation.add(immediate, grammar.productions[i][j], s);
          
          // Stop if it isn't nullable.
        
          if (!nullable[grammar.productions[i][k]])
            break;
          
        }
      
      }
    
    }
  
  }

  // Given a production B -> ... A β where β is nullable or is the empty string, follow(A) includes follow(B)

  for (i = 0; i < grammar.productions.length; i++) {
  
    // Scan from the end of the right side of the production to the beginning...
  
    for (j = grammar.productions[i].length - 1; j > 0; j--) {
    
      // If the symbol is a nonterminal, add the left side.
    
      if (nonterminals[grammar.productions[i][j]])
        Relation.add(propagation, grammar.productions[i][j], grammar.productions[i][0]);
      
      // If it isn't nullable, stop.
    
      if (!nullable[grammar.productions[i][j]])
        break;
    
    }
  
  }

  // Propagate the relation

  return Relation.propagate(immediate, propagation);

}

Calculations["grammar.endable"] = function(grammar) {
  
  var s;
  var endable = {};
  var follow = grammar.calculate("grammar.follow");
  
  for (s in follow) {
    if (follow[s][Grammar.END])
      endable[s] = true;
  }
  
  return endable;
  
}
