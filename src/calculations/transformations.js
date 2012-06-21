Calculations["transformations"] = function(grammar) {
  
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
  
  // Are there any rules of this form...
  //
  //   A -> A a_1 | A a_2 | ... | A a_m | b_1 | ... | b_n
  //
  // where m, n > 0?
  
  var candidates = {};
  var nt;
  
  for (nt in nonterminals)
    candidates[nt] = { recursive: [], base: [] };

  for (i = 0; i < grammar.productions.length; i++) {
    var nt = grammar.productions[i][0];
    
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
