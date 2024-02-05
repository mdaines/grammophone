import * as SetOperations from "../../../../set_operations.js";
import { getFirst } from "../helpers.js";

export default function(calculations) {
  const { nullAmbiguity, cycle } = calculations;

  var i, k, l, s;
  var head, body, bodyFirst;

  // We can return immediately if the grammar contains a null ambiguity.

  if (nullAmbiguity.length > 0) {
    return { member: false, reason: "it contains a null ambiguity" };
  }

  // Also, return immediately if the grammar contains a cycle.

  if (typeof cycle !== "undefined") {
    return { member: false, reason: "it contains a cycle" };
  }

  const { productions, first, follow, terminals, nonterminals, nullable } = calculations;

  // Check for first set clashes. Instead of checking intersections of
  // first sets of all productions alpha_i for a given nonterminal A,
  // set the [A, a] entry of a table for every a in first(alpha_i) for
  // all A and alpha_i in A -> alpha_1 | alpha_2 | ... | alpha_n. If we
  // come upon an entry that has already been set, there is a first
  // set clash.

  var table = {};

  for (k of nonterminals) {

    table[k] = {};

    for (l of terminals) {
      table[k][l] = false;
    }

  }

  for (i = 0; i < productions.length; i++) {

    head = productions[i][0];
    body = productions[i].slice(1);

    bodyFirst = getFirst(calculations, body);

    for (s of bodyFirst) {
      if (table[head][s]) {
        return { member: false, reason: "it contains a first set clash" };
      }

      table[head][s] = true;
    }

  }

  // Check for first/follow set clashes. That is, check that every nullable
  // production has disjoint first and follow sets.

  for (k of nullable) {
    if (SetOperations.any(SetOperations.intersection(first.get(k), follow.get(k)))) {
      return { member: false, reason: "it contains a first/follow set clash" };
    }

  }

  return { member: true };

}
