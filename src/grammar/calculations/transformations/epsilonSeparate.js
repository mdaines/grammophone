import { getNewSymbol } from "./helpers.js";

function epsilonSeparate({ productions, symbols }, group, epsilon) {

  var i;

  // Find a new symbol...

  var symbol = getNewSymbol(symbols, productions[group[0]][0]);

  // Copy productions to changes, marking those we're removing.

  var changes = [];
  var offset = 0;

  for (i = 0; i < productions.length; i++) {

    if (group.indexOf(i) !== -1 || i === epsilon) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }

  }

  // Add the separated version of the original rule

  changes.push({
    production: [productions[group[0]][0], symbol],
    operation: "insert",
    index: group[0]
  });

  changes.push({
    production: [productions[group[0]][0]],
    operation: "insert",
    index: group[0] + 1
  });

  // Add the non-epsilon production bodies with the new head

  for (i = 0; i < group.length; i++) {
    changes.push({
      production: [symbol].concat(productions[group[i]].slice(1)),
      operation: "insert",
      index: group[0] + i + 2
    });
  }

  return changes;

}

export default function({ productions, symbols, nonterminals }) {

  var nt, i;
  var result = [];
  var group;
  var epsilon;

  // For each nonterminal, determine if it is unambiguously nullable,
  // while collecting its non-null productions and its null (epsilon)
  // production. If it is unambiguously nullable, add it to the result.

  for (nt of nonterminals) {

    group = [];
    epsilon = -1;

    for (i = 0; i < productions.length; i++) {

      if (productions[i][0] === nt) {

        if (productions[i].length === 1) {
          if (epsilon !== -1) {
            break;
          }
          epsilon = i;
        } else {
          group.push(i);
        }

      }

    }

    if (i === productions.length && group.length > 0 && epsilon !== -1) {

      result.push({
        name: "epsilonSeparate",
        production: group[0],
        symbol: 0,
        changes: epsilonSeparate({ productions, symbols }, group, epsilon)
      });

    }

  }

  return result;

}
