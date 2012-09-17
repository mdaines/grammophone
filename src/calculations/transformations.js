(function() {
  this.Calculations || (this.Calculations = {});
  
  function expand(grammar, production, symbol) {
    
    var changes = [];
    
    // Remove the existing production
    
    changes.push({ operation: "delete", index: production });
    
    // Add new productions
    
    var offset = 0;
  
    for (i = 0; i < grammar.productions.length; i++) {
    
      if (grammar.productions[i][0] === grammar.productions[production][symbol]) {
      
        var p = grammar.productions[production].slice();
        var b = grammar.productions[i].slice(1);
        Array.prototype.splice.apply(p, [symbol, 1].concat(b));
        
        changes.push({ production: p, operation: "insert", index: production + offset });
        offset++;
      
      }
    
    }
  
    return changes;
    
  }

  this.Calculations["transformations.expand"] = function(grammar) {
  
    var i, j;
  
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var result = [];
  
    // Are there any nonterminals we can expand?

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {
      
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
  
  }
  
  function removeImmediateLeftRecursion(grammar, base, recursive) {
    
    var i, j;
    var nonterminals = grammar.calculate("grammar.nonterminals");
  
    // Find a new symbol for the right recursive production by adding primes
    // to the existing symbol.
  
    var symbol = grammar.productions[recursive[0]][0];
  
    do {
      symbol += "'";
    } while (typeof nonterminals[symbol] !== "undefined");
  
    // Copy productions to changes, marking those we're removing.
  
    var changes = [];
    var first;
    var offset = 0;
  
    for (i = 0; i < grammar.productions.length; i++) {
    
      if (base.indexOf(i) !== -1 || recursive.indexOf(i) !== -1) {
        
        changes.push({ index: i + offset, operation: "delete" });
        offset--;
        
        if (typeof first === "undefined")
          first = i;
      }
    
    }
  
    // Create the new productions...
    
    var offset = 0;
  
    // Base rules
  
    var added = [];
  
    for (i = 0; i < base.length; i++) {
    
      var production = [];
    
      for (j = 0; j < grammar.productions[base[i]].length; j++)
        production.push(grammar.productions[base[i]][j]);
      
      production.push(symbol);
    
      changes.push({ production: production, operation: "insert", index: first + offset });
      offset++;
    
    }
  
    // Recursive rules
  
    for (i = 0; i < recursive.length; i++) {
    
      var production = [];
    
      production.push(symbol);
    
      for (j = 2; j < grammar.productions[recursive[i]].length; j++)
        production.push(grammar.productions[recursive[i]][j]);
    
      production.push(symbol);
    
      changes.push({ production: production, operation: "insert", index: first + offset });
      offset++;
    
    }
  
    // Epsilon
  
    changes.push({ production: [symbol], operation: "insert", index: first + offset });
  
    return changes;
    
  }

  this.Calculations["transformations.removeImmediateLeftRecursion"] = function(grammar) {
   
    var i, j;
    
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var result = [];
    
    var candidates = {};
    var nt;
    
    // Are there any rules of this form...
    //
    //   A -> A a_1 | A a_2 | ... | A a_m | b_1 | ... | b_n
    //
    // where m, n > 0?
    
    for (nt in nonterminals)
      candidates[nt] = { recursive: [], base: [] };
    
    for (i = 0; i < grammar.productions.length; i++) {
      nt = grammar.productions[i][0];
    
      if (nt == grammar.productions[i][1])
        candidates[nt].recursive.push(i);
      else
        candidates[nt].base.push(i);
    }
    
    for (nt in candidates) {
    
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
   
  }
  
  function leftFactor(grammar, group, prefix) {
    
    var i, j;
    var nonterminals = grammar.calculate("grammar.nonterminals");
  
    // Find a new symbol...
  
    var symbol = grammar.productions[group[0]][0];
  
    do {
      symbol += "'";
    } while (typeof nonterminals[symbol] !== "undefined");
  
    // Copy productions to changes, marking those we're removing.
  
    var changes = [];
    var offset = 0;
  
    for (i = 0; i < grammar.productions.length; i++) {
    
      if (group.indexOf(i) !== -1) {
        changes.push({ index: i + offset, operation: "delete" });
        offset--;
      }
    
    }
  
    // Add the reference to the new symbol with the factored prefix
  
    changes.push({
      production: grammar.productions[group[0]].slice(0, prefix).concat(symbol),
      operation: "insert",
      index: group[0]
    });
  
    // Add the productions in the group
  
    for (i = 0; i < group.length; i++) {
      changes.push({
        production: [symbol].concat(grammar.productions[group[i]].slice(prefix)),
        operation: "insert",
        index: group[0] + i + 1
      });
    }
  
    return changes;
    
  }
  
  this.Calculations["transformations.leftFactor"] = function(grammar) {
  
    var i, j;
  
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var result = [];
  
    // Collect productions for each nonterminal (don't include empty productions)
  
    var productions = {};
    var nt;
  
    for (nt in nonterminals)
      productions[nt] = [];
  
    for (i = 0; i < grammar.productions.length; i++) {
      if (grammar.productions[i].length > 1)
        productions[grammar.productions[i][0]].push(i);
    }
  
    // For each nonterminal...
  
    for (nt in nonterminals) {
    
      // Sort by length of production
    
      productions[nt].sort(function(a, b) {
        return grammar.productions[a].length - grammar.productions[b].length;
      });
    
      // Remove rules from the grammar having the same prefix
    
      while (productions[nt].length > 0) {
      
        // Compare the first production against subsequent productions as
        // a prefix. If we find a match, add the production index to the
        // group of matches.
      
        var group = [productions[nt][0]];
        var prefix = grammar.productions[productions[nt][0]];
      
        for (i = 1; i < productions[nt].length; i++) {
        
          var compare = grammar.productions[productions[nt][i]];
        
          for (j = 1; j < prefix.length; j++) {
            if (prefix[j] != compare[j])
              break;
          }
        
          if (j == prefix.length)
            group.push(productions[nt][i]);
        
        }
      
        // If the group has more than one production, add it to the result.
      
        if (group.length > 1) {
        
          group.sort();
        
          result.push({
            name: "leftFactor",
            production: group[0],
            symbol: 0,
            changes: leftFactor(grammar, group, prefix.length)
          });
        
        }
      
        // Remove the productions in the group from the list of those to
        // consider on the next iteration. (We always remove at least one,
        // the "prefix".)
      
        for (i = 0; i < group.length; i++)
          productions[nt].splice(productions[nt].indexOf(group[i]), 1);
      
      }
    
    }
  
    return result;
  
  }
  
  function epsilonSeparate(grammar, group, epsilon) {
    
    var i, j;
    var nonterminals = grammar.calculate("grammar.nonterminals");
  
    // Find a new symbol...
  
    var symbol = grammar.productions[group[0]][0];
  
    do {
      symbol += "*";
    } while (typeof nonterminals[symbol] !== "undefined");
  
    // Copy productions to changes, marking those we're removing.
  
    var changes = [];
    var offset = 0;
  
    for (i = 0; i < grammar.productions.length; i++) {
    
      if (group.indexOf(i) !== -1 || i === epsilon) {
        changes.push({ index: i + offset, operation: "delete" });
        offset--;
      }
    
    }
    
    // Add the separated version of the original rule
  
    changes.push({
      production: [grammar.productions[group[0]][0], symbol],
      operation: "insert",
      index: group[0]
    });
  
    changes.push({
      production: [grammar.productions[group[0]][0]],
      operation: "insert",
      index: group[0] + 1
    });
    
    // Add the non-epsilon production bodies with the new head
  
    for (i = 0; i < group.length; i++) {
      changes.push({
        production: [symbol].concat(grammar.productions[group[i]].slice(1)),
        operation: "insert",
        index: group[0] + i + 2
      });
    }
    
    return changes;
    
  }
  
  this.Calculations["transformations.epsilonSeparate"] = function(grammar) {
    
    var nt, i;
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");
    var result = [];
    var group;
    var epsilon;
    
    // For each nonterminal, determine if it is unambiguously nullable,
    // while collecting its non-null productions and its null (epsilon)
    // production. If it is unambiguously nullable, add it to the result.
    
    for (nt in nonterminals) {
      
      group = [];
      epsilon = -1;
      
      for (i = 0; i < grammar.productions.length; i++) {
        
        if (grammar.productions[i][0] === nt) {
        
          if (grammar.productions[i].length === 1) {
            if (epsilon !== -1)
              break;
            epsilon = i;
          } else {
            group.push(i);
          }
          
        }
        
      }
      
      if (i === grammar.productions.length && epsilon !== -1) {
        
        result.push({
          name: "epsilonSeparate",
          production: group[0],
          symbol: 0,
          changes: epsilonSeparate(grammar, group, epsilon)
        });
        
      }
      
    }
    
    return result;
    
  }

  this.Calculations["transformations"] = function(grammar) {
    
    return [].concat(grammar.calculate("transformations.expand"))
             .concat(grammar.calculate("transformations.removeImmediateLeftRecursion"))
             .concat(grammar.calculate("transformations.leftFactor"))
             .concat(grammar.calculate("transformations.epsilonSeparate"));
  
  }

}).call(this);
