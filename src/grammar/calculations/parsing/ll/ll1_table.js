var END = require("../../../symbols").END;

module.exports = function(grammar) {

  var i, k, l, s;
  var table = {};
  var head, body, first;

  var terminals = grammar.calculate("grammar.terminals");
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var follow = grammar.calculate("grammar.follow");

  // Populate table with blank arrays

  for (k of nonterminals) {

    table[k] = {};

    for (l of terminals) {
      table[k][l] = [];
    }

    table[k][END] = [];

  }

  // Collect moves

  for (i = 0; i < grammar.productions.length; i++) {

    head = grammar.productions[i][0];
    body = grammar.productions[i].slice(1);

    // Get the first set of the production's body

    first = grammar.getFirst(body);

    // For each symbol s in first(body), add the production
    // to table[nonterminal][s].

    for (s of first) {
      table[head][s].push(i);
    }

    // If the production is nullable, for each symbol s of follow(head),
    // add this production to table[head][s].

    if (grammar.isNullable(body)) {

      for (s of follow.get(head)) {
        table[head][s].push(i);
      }

    }

  }

  return table;

};
