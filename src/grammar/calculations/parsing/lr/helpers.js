// Calculations for building LR(0), LR(1), SLR(1), and LALR(1)
// automata and parsing tables.
//
// Automata are lists of states like this:
//
//   { kernel: [ ... ], items: [ ... ], transitions: { ... } }
//
// Items:
//
//   LR0: { production: -1, index: 0 }
//   LR1: { production: -1, index: 0, lookahead: Grammar.END }
//   LALR1: { production: -1, index: 0, lookaheads: [ Grammar.END, "XYZ" ] }
//
// Parsing tables are also lists of states, each of which are objects
// representing the entries in the parsing table for that state.
//
// Rows for LR(0) parsing tables:
//
//   { shift: { ... }, reduce: [ ... ] }
//
// Examples:
//
//   { shift: { "(": 3, "a": 2, "A": 1 } }
//   { reduce: -1 }
//
// -1 = augmented start state production.
//
// Rows for SLR(1), LR(1), and LALR(1) tables:
//
//   { "symbol": { shift: 6, reduce: [3] }, ... }
//
// Examples:
//
//   { "else": { shift: 6, reduce: [3] } }
//   { "if": { shift: 4 }, "other": { shift: 3 }, "S": { shift: 7 }, "I": { shift: 2 } }

// Build an LR automaton for the grammar, using the provided "build" functions.

export function automaton(calculations, build) {

  var states = [ { kernel: build.initial() } ];

  var state;
  var l;
  var s = 0;

  var transitions, symbol, kernel;
  var i;

  // While no more states have been added... (outer loop)

  while (s < states.length) {

    // Process existing states... (inner loop)

    for (l = states.length; s < l; s++) {

      state = states[s];

      // Find the closure of the state's kernel

      state.items = build.closure(calculations, state.kernel);

      // Find the transitions out of the state (a map from symbol to kernel)

      transitions = build.transitions(calculations, state.items);

      // Build the state's list of transitions...

      state.transitions = {};

      for (symbol in transitions) {

        // Given a symbol and kernel in the transition map, find out if we've
        // already added the kernel as a state. If we have, assign that state's
        // index to the transition table for the symbol. If not, create a
        // new state.

        kernel = transitions[symbol];

        for (i = 0; i < states.length; i++) {

          if (build.same(states[i].kernel, kernel)) {
            state.transitions[symbol] = i;
            break;
          }

        }

        if (i === states.length) {

          state.transitions[symbol] = states.length;
          states.push({ kernel: kernel });

        }

      }

    }

  }

  return states;

}

export function classifyLR1(table) {

  var i, s;

  for (i = 0; i < table.length; i++) {

    for (s in table[i]) {

      if (typeof table[i][s].reduce !== "undefined" && table[i][s].reduce.length > 1) {
        return { member: false, reason: "it contains a reduce-reduce conflict" };
      }

      if (typeof table[i][s].shift !== "undefined" && typeof table[i][s].reduce !== "undefined" && table[i][s].reduce.length > 0) {
        return { member: false, reason: "it contains a shift-reduce conflict" };
      }

    }

  }

  return { member: true };

}

export function addReduceAction(actions, symbol, production) {

  if (typeof actions[symbol] === "undefined") {
    actions[symbol] = { reduce: [] };
  }

  if (typeof actions[symbol].reduce === "undefined") {
    actions[symbol].reduce = [];
  }

  actions[symbol].reduce.push(production);

}

// Collapse a list of LR1 items' lookaheads so that distinct
// items' lookaheads are arrays.

export function collapseLookaheads(items) {

  var i, p, x, l;
  var table = {};

  for (i = 0; i < items.length; i++) {

    p = items[i].production;
    x = items[i].index;
    l = items[i].lookahead;

    if (!table[p]) {
      table[p] = [];
    }

    if (!table[p][x]) {
      table[p][x] = [];
    }

    table[p][x].push(l);

  }

  var result = [];

  for (p in table) {
    for (x in table[p]) {
      result.push({ production: parseInt(p), index: parseInt(x), lookaheads: table[p][x] });
    }
  }

  return result;

}

// Return the union of the items in two LALR1 states.
// For each item in the first state, add lookaheads from the second state's corresponding items.

export function mergeItems(a, b) {

  var result = [];
  var item;
  var i, j, k;

  for (i = 0; i < a.length; i++) {

    item = { production: a[i].production, index: a[i].index, lookaheads: [] };

    // Add lookaheads from a

    for (j = 0; j < a[i].lookaheads.length; j++) {
      item.lookaheads.push(a[i].lookaheads[j]);
    }

    // Find matching items in b and add their lookaheads if they aren't already present

    for (j = 0; j < b.length; j++) {

      if (b[j].production == a[i].production && b[j].index == a[i].index) {

        for (k = 0; k < b[j].lookaheads.length; k++) {
          if (item.lookaheads.indexOf(b[j].lookaheads[k]) === -1) {
            item.lookaheads.push(b[j].lookaheads[k]);
          }
        }

      }

    }

    result.push(item);

  }

  return result;

}
