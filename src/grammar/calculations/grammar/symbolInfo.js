export default function({ productions, nonterminals, terminals }) {

  var i, j, s;

  var terminalOrder = [];
  var nonterminalOrder = [];
  var productionOrder = [];

  for (i = 0; i < productions.length; i++) {

    s = productions[i][0];

    if (productionOrder.indexOf(s) === -1) {
      productionOrder.push(s);
    }

    for (j = 0; j < productions[i].length; j++) {

      s = productions[i][j];

      if (nonterminals.has(s) && nonterminalOrder.indexOf(s) === -1) {
        nonterminalOrder.push(s);
      }

      if (terminals.has(s) && terminalOrder.indexOf(s) === -1) {
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

}
