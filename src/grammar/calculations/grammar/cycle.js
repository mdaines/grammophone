import Relation from "../../../relation.js";

export default function(grammar) {

  var relation;
  var i, j, k;
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var nullable = grammar.calculate("grammar.nullable");

  // Build relation
  // (x,y) | x -> a y b, y a nonterminal, a and b nullable

  relation = new Relation();

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      if (nonterminals.has(grammar.productions[i][j])) {

        for (k = 1; k < grammar.productions[i].length; k++) {

          if (j === k) {
            continue;
          }

          if (!nonterminals.has(grammar.productions[i][k]) || !nullable.has(grammar.productions[i][k])) {
            break;
          }

        }

        if (k === grammar.productions[i].length) {
          relation.add(grammar.productions[i][0], grammar.productions[i][j]);
        }

      }

    }
  }

  // Find a cycle if there is one

  return relation.cycle();

}
