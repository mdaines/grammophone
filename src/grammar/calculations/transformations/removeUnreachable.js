'use strict';

function removeUnreachable(grammar, group) {
  
  let changes = [];
  let offset = 0;
  
  const productions = grammar.calculate("grammar.productions");
  
  // Remove all productions in the group.

  for (let i = 0; i < productions.length; i++) {
  
    if (group.indexOf(i) !== -1) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }
  
  }
  
  return changes;
  
}

module.exports["transformations.removeUnreachable"] = function(grammar) {
  
  const unreachable = grammar.calculate("grammar.unreachable");
  const productions = grammar.calculate("grammar.productions");
  
  let result = [];
  
  for (let nt in unreachable) {
    
    let group = [];
    
    for (let i = 0; i < productions.length; i++) {
      
      if (productions[i][0] === nt) {
        group.push(i);
      }
      
    }
    
    if (group.length > 0) {
      
      result.push({
        name: "removeUnreachable",
        production: group[0],
        symbol: 0,
        changes: removeUnreachable(grammar, group)
      });
      
    }
    
  }
  
  return result;
  
};
