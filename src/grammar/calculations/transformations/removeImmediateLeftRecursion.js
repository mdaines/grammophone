import { getNewSymbol } from "./helpers.js";

function removeImmediateLeftRecursion({ productions, symbols }, base, recursive) {

  var i, j;
  var production;

  // Find a new symbol for the right recursive production by adding primes
  // to the existing symbol.

  var symbol = getNewSymbol(symbols, productions[recursive[0]][0]);

  // Copy productions to changes, marking those we're removing.

  var changes = [];
  var first;
  var offset = 0;

  for (i = 0; i < productions.length; i++) {

    if (base.indexOf(i) !== -1 || recursive.indexOf(i) !== -1) {

      changes.push({ index: i + offset, operation: "delete" });
      offset--;

      if (typeof first === "undefined") {
        first = i;
      }
    }

  }

  // Create the new productions...

  offset = 0;

  // Base rules

  for (i = 0; i < base.length; i++) {

    production = [];

    for (j = 0; j < productions[base[i]].length; j++) {
      production.push(productions[base[i]][j]);
    }

    production.push(symbol);

    changes.push({ production: production, operation: "insert", index: first + offset });
    offset++;

  }

  // Recursive rules

  for (i = 0; i < recursive.length; i++) {

    production = [];

    production.push(symbol);

    for (j = 2; j < productions[recursive[i]].length; j++) {
      production.push(productions[recursive[i]][j]);
    }

    production.push(symbol);

    changes.push({ production: production, operation: "insert", index: first + offset });
    offset++;

  }

  // Epsilon

  changes.push({ production: [symbol], operation: "insert", index: first + offset });

  return changes;

}

export default function({ productions, nonterminals, symbols }) {

  var i;

  var result = [];

  var candidates = {};
  var nt;

  // Are there any rules of this form...
  //
  //   A -> A a_1 | A a_2 | ... | A a_m | b_1 | ... | b_n
  //
  // where m, n > 0?

  for (nt of nonterminals) {
    candidates[nt] = { recursive: [], base: [] };
  }

  for (i = 0; i < productions.length; i++) {
    nt = productions[i][0];

    if (nt == productions[i][1]) {
      candidates[nt].recursive.push(i);
    } else {
      candidates[nt].base.push(i);
    }
  }

  for (nt in candidates) {

    if (candidates[nt].recursive.length > 0 && candidates[nt].base.length > 0) {

      result.push({
        name: "removeImmediateLeftRecursion",
        production: candidates[nt].recursive[0],
        symbol: 0,
        changes: removeImmediateLeftRecursion({ productions, symbols }, candidates[nt].base, candidates[nt].recursive)
      });

    }

  }

  return result;

}
