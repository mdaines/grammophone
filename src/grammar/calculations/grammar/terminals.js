module.exports = function(grammar) {

  var i, j;
  var terminals = {};
  var nonterminals = grammar.calculate("grammar.nonterminals");

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      if (!nonterminals[grammar.productions[i][j]]) {
        terminals[grammar.productions[i][j]] = true;
      }

    }
  }

  return terminals;

};
