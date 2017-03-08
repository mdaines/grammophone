'use strict';

module.exports["grammar.symbolInfo"] = function(grammar) {

  let terminalOrder = [];
  let nonterminalOrder = [];
  let productionOrder = [];
  
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const terminals = grammar.calculate("grammar.terminals");

  for (let i = 0; i < grammar.productions.length; i++) {
    
    let s = grammar.productions[i][0];
    
    if (productionOrder.indexOf(s) === -1) {
      productionOrder.push(s);
    }
      
    for (let j = 0; j < grammar.productions[i].length; j++) {
      
      let s = grammar.productions[i][j];
    
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
