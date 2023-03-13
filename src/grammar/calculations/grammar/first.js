import Relation from "../../../relation.js";

export default function({ productions, nullable, nonterminals }) {

  var immediate, propagation, result;
  var i, j;

  immediate = new Relation();
  propagation = new Relation();

  // For each production, add the first terminal symbol after a sequence of nullable symbols.

  for (i = 0; i < productions.length; i++) {

    // Skip nullable symbols...

    for (j = 1; j < productions[i].length; j++) {

      if (!nullable.has(productions[i][j])) {
        break;
      }

    }

    // If the first non-nullable symbol is a terminal, add it to the immediate first set
    // of this nonterminal.

    if (j < productions[i].length && !nonterminals.has(productions[i][j])) {
      immediate.add(productions[i][0], productions[i][j]);
    }

  }

  // For each production, add the prefix of nullable nonterminals, and then the next symbol
  // if it is also a nonterminal.

  for (i = 0; i < productions.length; i++) {
    for (j = 1; j < productions[i].length; j++) {

      // Is it a nonterminal? Add it.

      if (nonterminals.has(productions[i][j])) {
        propagation.add(productions[i][0], productions[i][j]);
      }

      // Is it not nullable? Stop.

      if (!nullable.has(productions[i][j])) {
        break;
      }

    }
  }

  // Propagate the relation.

  result = immediate.propagate(propagation);

  return result;

}
