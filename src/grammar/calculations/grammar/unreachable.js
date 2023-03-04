import Relation from "../../../relation.js";

export default function(grammar) {

  var relation, closure, unreachable;
  var i, j, s;

  var nonterminals = grammar.calculate("grammar.nonterminals");
  var start = grammar.calculate("grammar.start");

  // Build relation:
  // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

  relation = new Relation();

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      if (nonterminals.has(grammar.productions[i][j])) {
        relation.add(grammar.productions[i][0], grammar.productions[i][j]);
      }

    }
  }

  // Obtain the closure of the relation

  closure = relation.closure();

  // Collect unreachable nonterminals

  unreachable = new Set();

  for (s of nonterminals) {

    if (s != start && (!closure.has(start, s))) {
      unreachable.add(s);
    }

  }

  return unreachable;

}
