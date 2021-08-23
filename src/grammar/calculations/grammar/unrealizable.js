module.exports = function(grammar) {

  var marked, added, unrealizable;
  var i, j, s;
  var nonterminals = grammar.calculate("grammar.nonterminals");

  // Is a particular nonterminal realizable?

  marked = new Set();

  do {

    added = [];

    for (i = 0; i < grammar.productions.length; i++) {

      // Are there any unmarked nonterminals? Break at the first one.

      for (j = 1; j < grammar.productions[i].length; j++) {

        if (!marked.has(grammar.productions[i][j]) && nonterminals.has(grammar.productions[i][j])) {
          break;
        }

      }

      // If the head of this production is not marked, and all of the symbols in
      // the body of the production were not unmarked nonterminals (ie, they were
      // either marked or terminals), mark the head and record
      // that we marked it in this step.

      if (!marked.has(grammar.productions[i][0]) && j == grammar.productions[i].length) {
        marked.add(grammar.productions[i][0]);
        added.push(grammar.productions[i][0]);
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

};
