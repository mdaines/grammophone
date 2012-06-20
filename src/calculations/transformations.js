Calculations["transformations"] = function(grammar) {
  
  var i, j;
  
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var result = [];

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
