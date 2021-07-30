var Sets = require("../../../sets");
var END = require("../../symbols").END;

module.exports["parsing.ll.ll1_classification"] = function(grammar) {

  var p, i, j, k, l, s;
  var head, body, first;

  var nullAmbiguity = grammar.calculate("grammar.nullAmbiguity");

  // We can return immediately if the grammar contains a null ambiguity.

  if (nullAmbiguity.length > 0)
    return { member: false, reason: "it contains a null ambiguity" };

  var follow = grammar.calculate("grammar.follow");
  var terminals = grammar.calculate("grammar.terminals");
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var nullable = grammar.calculate("grammar.nullable");

  // Check for first set clashes. Instead of checking intersections of
  // first sets of all productions alpha_i for a given nonterminal A,
  // set the [A, a] entry of a table for every a in first(alpha_i) for
  // all A and alpha_i in A -> alpha_1 | alpha_2 | ... | alpha_n. If we
  // come upon an entry that has already been set, there is a first
  // set clash.

  var table = {};

  for (k in nonterminals) {

    table[k] = {};

    for (l in terminals)
      table[k][l] = false;

  }

  for (i = 0; i < grammar.productions.length; i++) {

    head = grammar.productions[i][0];
    body = grammar.productions[i].slice(1);

    first = grammar.getFirst(body);

    for (s in first) {
      if (table[head][s])
        return { member: false, reason: "it contains a first set clash" };

      table[head][s] = true;
    }

  }

  // Check for first/follow set clashes. That is, check that every nullable
  // production has disjoint first and follow sets.

  first = grammar.calculate("grammar.first");

  for (k in nullable) {

    if (Sets.any(Sets.intersection(first[k], follow[k])))
      return { member: false, reason: "it contains a first/follow set clash" };

  }

  return { member: true };

}

module.exports["parsing.ll.ll1_table"] = function(grammar) {

  var i, k, l, s;
  var table = {};
  var head, body, first;

  var terminals = grammar.calculate("grammar.terminals");
  var nonterminals = grammar.calculate("grammar.nonterminals");
  var follow = grammar.calculate("grammar.follow");

  // Populate table with blank arrays

  for (k in nonterminals) {

    table[k] = {};

    for (l in terminals)
      table[k][l] = [];

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

    for (s in first)
      table[head][s].push(i);

    // If the production is nullable, for each symbol s of follow(head),
    // add this production to table[head][s].

    if (grammar.isNullable(body)) {

      for (s in follow[head])
        table[head][s].push(i);

    }

  }

  return table;

};
