import { END } from "../../../symbols.js";
import { getFirst, isNullable } from "../helpers.js";

export default function(calculations) {

  const { productions, terminals, nonterminals, follow } = calculations;

  var i, k, l, s;
  var table = {};
  var head, body, bodyFirst;

  // Populate table with blank arrays

  for (k of nonterminals) {

    table[k] = {};

    for (l of terminals) {
      table[k][l] = [];
    }

    table[k][END] = [];

  }

  // Collect moves

  for (i = 0; i < productions.length; i++) {

    head = productions[i][0];
    body = productions[i].slice(1);

    // Get the first set of the production's body

    bodyFirst = getFirst(calculations, body);

    // For each symbol s in first(body), add the production
    // to table[nonterminal][s].

    for (s of bodyFirst) {
      table[head][s].push(i);
    }

    // If the production is nullable, for each symbol s of follow(head),
    // add this production to table[head][s].

    if (isNullable(calculations, body)) {

      for (s of follow.get(head)) {
        table[head][s].push(i);
      }

    }

  }

  return table;

}
