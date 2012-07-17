(function() {
  this.Calculations || (this.Calculations = {});

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
            symbol: j
          });
        
        }
      
      }
    }
  
    return result;
  
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
          recursive: candidates[nt].recursive,
          base: candidates[nt].base,
          production: candidates[nt].recursive[0],
          symbol: 0
        });
      
      }
    
    }
  
    return result;
  
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
            productions: group,
            prefix: prefix.length
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

  this.Calculations["transformations"] = function(grammar) {
  
    var result = [];
  
    result = result.concat(grammar.calculate("transformations.expand"));
    result = result.concat(grammar.calculate("transformations.removeImmediateLeftRecursion"));
    result = result.concat(grammar.calculate("transformations.leftFactor"));
  
    return result;
  
  }

}).call(this);
