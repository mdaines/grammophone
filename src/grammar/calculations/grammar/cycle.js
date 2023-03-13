import Relation from "../../../relation.js";

export default function({ productions, nonterminals, nullable }) {

  var relation;
  var i, j, k;

  // Build relation
  // (x,y) | x -> a y b, y a nonterminal, a and b nullable

  relation = new Relation();

  for (i = 0; i < productions.length; i++) {
    for (j = 1; j < productions[i].length; j++) {

      if (nonterminals.has(productions[i][j])) {

        for (k = 1; k < productions[i].length; k++) {

          if (j === k) {
            continue;
          }

          if (!nonterminals.has(productions[i][k]) || !nullable.has(productions[i][k])) {
            break;
          }

        }

        if (k === productions[i].length) {
          relation.add(productions[i][0], productions[i][j]);
        }

      }

    }
  }

  // Find a cycle if there is one

  return relation.cycle();

}
