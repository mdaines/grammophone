export default function({ productions, nonterminals, nullable }) {

  var found;
  var nt;
  var i, j;

  // For each nonterminal...

  for (nt of nonterminals) {

    // Look through the productions of this nonterminal for
    // productions which are nullable. If we find more than
    // one, return them as an array (in order).

    found = undefined;

    for (i = 0; i < productions.length; i++) {

      if (productions[i][0] == nt) {

        // An empty production is nullable.

        if (productions[i].length == 1) {

          if (typeof found !== "undefined") {
            return i < found ? [i, found] : [found, i];
          } else {
            found = i;
          }

          continue;

        }

        // A production is nullable if all of its symbols are nullable.

        for (j = 1; j < productions[i].length; j++) {

          if (!nullable.has(productions[i][j])) {
            break;
          }

        }

        if (j == productions[i].length) {

          if (typeof found !== "undefined") {
            return i < found ? [i, found] : [found, i];
          } else {
            found = i;
          }

        }

      }

    }

  }

  return [];

}
