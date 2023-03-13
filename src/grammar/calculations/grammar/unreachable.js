import Relation from "../../../relation.js";

export default function({ productions, nonterminals, start }) {

  var relation, closure, unreachable;
  var i, j, s;

  // Build relation:
  // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

  relation = new Relation();

  for (i = 0; i < productions.length; i++) {
    for (j = 1; j < productions[i].length; j++) {

      if (nonterminals.has(productions[i][j])) {
        relation.add(productions[i][0], productions[i][j]);
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
