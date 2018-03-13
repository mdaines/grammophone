'use strict';

const Relations = require('../../../relations');

module.exports["grammar.first"] = function(grammar) {

  const nullable = grammar.calculate("grammar.nullable");
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const productions = grammar.calculate("grammar.productions");

  let immediate = Relations.create();
  let propagation = Relations.create();

  // For each production, add the first terminal symbol after a sequence of nullable symbols.

  for (let i = 0; i < productions.length; i++) {

    // Skip nullable symbols...

    let j;

    for (j = 1; j < productions[i].length; j++) {

      if (!nullable[productions[i][j]]) {
        break;
      }

    }

    // If the first non-nullable symbol is a terminal, add it to the immediate first set
    // of this nonterminal.

    if (j < productions[i].length && !nonterminals[productions[i][j]]) {
      Relations.add(immediate, productions[i][0], productions[i][j]);
    }

  }

  // For each production, add the prefix of nullable nonterminals, and then the next symbol
  // if it is also a nonterminal.

  for (let i = 0; i < productions.length; i++) {
    for (let j = 1; j < productions[i].length; j++) {

      // Is it a nonterminal? Add it.

      if (nonterminals[productions[i][j]]) {
        Relations.add(propagation, productions[i][0], productions[i][j]);
      }

      // Is it not nullable? Stop.

      if (!nullable[productions[i][j]]) {
        break;
      }

    }
  }

  // Propagate the relation.

  let result = Relations.propagate(immediate, propagation);

  // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.

  for (let k in nonterminals) {
    if (typeof result[k] === "undefined") {
      result[k] = {};
    }
  }

  return result;

};
