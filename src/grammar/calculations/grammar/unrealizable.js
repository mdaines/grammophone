export default function({ productions, nonterminals }) {

  var marked, added, unrealizable;
  var i, j, s;

  // Is a particular nonterminal realizable?

  marked = new Set();

  do {

    added = [];

    for (i = 0; i < productions.length; i++) {

      // Are there any unmarked nonterminals? Break at the first one.

      for (j = 1; j < productions[i].length; j++) {

        if (!marked.has(productions[i][j]) && nonterminals.has(productions[i][j])) {
          break;
        }

      }

      // If the head of this production is not marked, and all of the symbols in
      // the body of the production were not unmarked nonterminals (ie, they were
      // either marked or terminals), mark the head and record
      // that we marked it in this step.

      if (!marked.has(productions[i][0]) && j == productions[i].length) {
        marked.add(productions[i][0]);
        added.push(productions[i][0]);
      }

    }

  } while (added.length > 0);

  // Collect nonterminals which were not marked.

  unrealizable = new Set();

  for (s of nonterminals) {

    if (!marked.has(s)) {
      unrealizable.add(s);
    }

  }

  return unrealizable;

}
