'use strict';

const Relations = require('../../../relations');
const END = require('../../symbols').END;

module.exports["grammar.follow"] = function(grammar) {

  let immediate, propagation, result;
  const first = grammar.calculate("grammar.first");
  const nullable = grammar.calculate("grammar.nullable");
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const start = grammar.calculate("grammar.start");
  const productions = grammar.calculate("grammar.productions");

  immediate = Relations.create();
  propagation = Relations.create();

  // Add the end of input symbol to the immediate follow set of the grammar's start symbol.

  Relations.add(immediate, start, END);

  // Given a production X -> ... A β, follow(A) includes first(β), except for the empty string.

  for (let i = 0; i < productions.length; i++) {

    for (let j = 1; j < productions[i].length - 1; j++) {

      // If the symbol is a nonterminal...

      if (nonterminals[productions[i][j]]) {

        // Add the first set of the remaining symbols to the follow set of the symbol

        for (let k = j + 1; k < productions[i].length; k++) {

          // If this symbol is a terminal, add it, and then stop adding.

          if (!nonterminals[productions[i][k]]) {
            Relations.add(immediate, productions[i][j], productions[i][k]);
            break;
          }

          // If it is a nonterminal, add the first set of that nonterminal.

          for (let s in first[productions[i][k]]) {
            Relations.add(immediate, productions[i][j], s);
          }

          // Stop if it isn't nullable.

          if (!nullable[productions[i][k]]) {
            break;
          }

        }

      }

    }

  }

  // Given a production B -> ... A β where β is nullable or is the empty string, follow(A) includes follow(B)

  for (let i = 0; i < productions.length; i++) {

    // Scan from the end of the right side of the production to the beginning...

    for (let j = productions[i].length - 1; j > 0; j--) {

      // If the symbol is a nonterminal, add the left side.

      if (nonterminals[productions[i][j]]) {
        Relations.add(propagation, productions[i][j], productions[i][0]);
      }

      // If it isn't nullable, stop.

      if (!nullable[productions[i][j]]) {
        break;
      }

    }

  }

  // Propagate the relation

  result = Relations.propagate(immediate, propagation);

  // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.

  for (let k in nonterminals) {
    if (typeof result[k] === "undefined") {
      result[k] = {};
    }
  }

  return result;

};
