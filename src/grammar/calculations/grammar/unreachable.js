var Relation = require('../../../relation');

module.exports = function(grammar) {

  var relation, closure, unreachable;
  var i, j, s;

  var nonterminals = grammar.calculate("grammar.nonterminals");
  var start = grammar.calculate("grammar.start");

  // Build relation:
  // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

  relation = Relation.create();

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      if (nonterminals[grammar.productions[i][j]]) {
        Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);
      }

    }
  }

  // Obtain the closure of the relation

  closure = Relation.closure(relation);

  // Collect unreachable nonterminals

  unreachable = {};

  for (s in nonterminals) {

    if (s != start && (!closure[start] || !closure[start][s])) {
      unreachable[s] = true;
    }

  }

  return unreachable;

};
