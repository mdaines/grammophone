'use strict';

module.exports["grammar.symbolInfo"] = function(grammar) {

  let terminalOrder = [];
  let nonterminalOrder = [];
  let productionOrder = [];
  
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const terminals = grammar.calculate("grammar.terminals");
  const productions = grammar.calculate("grammar.productions");

  for (let i = 0; i < productions.length; i++) {
    
    let s = productions[i][0];
    
    if (productionOrder.indexOf(s) === -1) {
      productionOrder.push(s);
    }
      
    for (let j = 0; j < productions[i].length; j++) {
      
      let s = productions[i][j];
    
      if (nonterminals[s] && nonterminalOrder.indexOf(s) === -1) {
        nonterminalOrder.push(s);
      }
      
      if (terminals[s] && terminalOrder.indexOf(s) === -1) {
        terminalOrder.push(s);
      }
    
    }
    
  }

  return {
    terminalOrder: terminalOrder,
    nonterminalOrder: nonterminalOrder,
    productionOrder: productionOrder,
    
    nonterminals: nonterminals,
    terminals: terminals
  };

};
