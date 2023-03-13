import Relation from "../../../relation.js";
import { END } from "../../symbols.js";

export default function({ productions, first, nullable, nonterminals, start }) {

  var immediate, propagation, result;
  var i, j, k, s;

  immediate = new Relation();
  propagation = new Relation();

  // Add the end of input symbol to the immediate follow set of the grammar's start symbol.

  immediate.add(start, END);

  // Given a production X -> ... A β, follow(A) includes first(β), except for the empty string.

  for (i = 0; i < productions.length; i++) {

    for (j = 1; j < productions[i].length - 1; j++) {

      // If the symbol is a nonterminal...

      if (nonterminals.has(productions[i][j])) {

        // Add the first set of the remaining symbols to the follow set of the symbol

        for (k = j + 1; k < productions[i].length; k++) {

          // If this symbol is a terminal, add it, and then stop adding.

          if (!nonterminals.has(productions[i][k])) {
            immediate.add(productions[i][j], productions[i][k]);
            break;
          }

          // If it is a nonterminal, add the first set of that nonterminal.

          for (s of first.get(productions[i][k])) {
            immediate.add(productions[i][j], s);
          }

          // Stop if it isn't nullable.

          if (!nullable.has(productions[i][k])) {
            break;
          }

        }

      }

    }

  }

  // Given a production B -> ... A β where β is nullable or is the empty string, follow(A) includes follow(B)

  for (i = 0; i < productions.length; i++) {

    // Scan from the end of the right side of the production to the beginning...

    for (j = productions[i].length - 1; j > 0; j--) {

      // If the symbol is a nonterminal, add the left side.

      if (nonterminals.has(productions[i][j])) {
        propagation.add(productions[i][j], productions[i][0]);
      }

      // If it isn't nullable, stop.

      if (!nullable.has(productions[i][j])) {
        break;
      }

    }

  }

  // Propagate the relation

  result = immediate.propagate(propagation);

  return result;

}
