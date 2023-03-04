export default function(grammar) {

  var i, j;
  var terminals = new Set();
  var nonterminals = grammar.calculate("grammar.nonterminals");

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      if (!nonterminals.has(grammar.productions[i][j])) {
        terminals.add(grammar.productions[i][j]);
      }

    }
  }

  return terminals;

}
