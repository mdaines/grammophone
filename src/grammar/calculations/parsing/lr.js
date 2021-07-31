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

var END = require("../../symbols").END;

// Build an LR automaton for the grammar, using the provided "build" functions.

function automaton(grammar, build) {

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

      state.items = build.closure(grammar, state.kernel);

      // Find the transitions out of the state (a map from symbol to kernel)

      transitions = build.transitions(grammar, state.items);

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

// lr0 and lr1 objects define the "build" functions for forming LR automata.

var lr0 = {

  // What is the initial item?

  initial: function() {

    // production is an index into the grammar's list of productions,
    // index is the distinguished position in that production,
    // -1 is the production added by augmenting the grammar.

    return [ { production: -1, index: 0 } ];

  },

  // Given an item's kernel, find its epsilon closure of items.

  closure: function(grammar, kernel) {

    var i, j;
    var item, symbol;
    var start = grammar.calculate("grammar.start");

    // Which items were added?

    var added;

    // Which productions have been used?

    var used = {};

    // Copy the kernel as the initial list of items

    var result = [];

    for (i = 0; i < kernel.length; i++)
      result.push({ production: kernel[i].production, index: kernel[i].index });

    // While we cannot add more items...

    do {

      added = [];

      // For each item we have...

      for (i = 0; i < result.length; i++) {

        // Find the nonterminal symbol...

        item = result[i];

        // If the production is the augmented start production, we're looking
        // for the original start symbol. Otherwise, use the grammar's productions
        // to find the symbol, but add one to account for the left-hand side of
        // the production.

        if (item.production === -1)
          symbol = [start][item.index];
        else
          symbol = grammar.productions[item.production][item.index + 1];

        // Find unused matching productions and add them.

        for (j = 0; j < grammar.productions.length; j++) {

          if (!used[j] && grammar.productions[j][0] == symbol) {
            added.push({ production: j, index: 0 });
            used[j] = true;
          }

        }

      }

      for (i = 0; i < added.length; i++)
        result.push(added[i]);

    } while (added.length > 0);

    return result;

  },

  // For the given list of (closure) items, return a map from symbol to kernel
  // representing the transitions that can be taken out of the
  // corresponding state.

  transitions: function(grammar, closure) {

    var result = {};
    var i;
    var item, symbol;
    var start = grammar.calculate("grammar.start");

    // For each item...

    for (i = 0; i < closure.length; i++) {

      item = closure[i];

      // Calculate the leaving symbol by looking in the grammar's productions,
      // handling the augmented grammar production as above.

      if (item.production === -1)
        symbol = [start][item.index];
      else
        symbol = grammar.productions[item.production][item.index + 1];

      // If there is a leaving symbol, add the next item.

      if (typeof symbol != "undefined") {

        if (!result[symbol])
          result[symbol] = [];

        result[symbol].push({ production: item.production, index: item.index + 1 });

      }

    }

    return result;

  },

  // Are the two kernels equal?

  same: function(a, b) {

    var i, j;

    if (a.length !== b.length)
      return false;

    for (i = 0; i < a.length; i++) {

      for (j = 0; j < b.length; j++) {

        if (a[i].production === b[j].production && a[i].index === b[j].index)
          break;

      }

      if (j === b.length)
        return false;

    }

    return true;

  }

}

var lr1 = {

  initial: function() {

    return [ { production: -1, index: 0, lookahead: END } ];

  },

  closure: function(grammar, kernel) {

    var i, j, l;
    var item, remaining, symbol, lookaheads;
    var start = grammar.calculate("grammar.start");

    // Which items were added in a given iteration?

    var added;

    // Which productions/lookaheads have we already used for the closure?

    var used = {};

    for (i = 0; i < grammar.productions.length; i++)
      used[i] = {};

    // Copy the kernel as the initial list of items

    var result = [];

    for (i = 0; i < kernel.length; i++)
      result.push({ production: kernel[i].production, index: kernel[i].index, lookahead: kernel[i].lookahead });

    // While we cannot add more items...

    do {

      added = [];

      // For each item we have...

      for (i = 0; i < result.length; i++) {

        item = result[i];

        // Find the nonterminal symbol...

        // Find the stuff "after the dot" (taking into account the augmented grammar)

        if (item.production === -1)
          remaining = [start].slice(item.index);
        else
          remaining = grammar.productions[item.production].slice(item.index + 1);

        // Go to next item if this one is completed

        if (remaining.length == 0)
          continue;

        // the nonterminal symbol is the first thing after the dot

        symbol = remaining[0];

        // lookaheads
        // first(gamma a) where the item is [A -> alpha . B gamma, a]

        lookaheads = grammar.getFirst(remaining.slice(1).concat(item.lookahead));

        // Add items for matching productions/lookaheads (which are not already
        // used for the closure)

        for (j = 0; j < grammar.productions.length; j++) {

          if (grammar.productions[j][0] == symbol) {

            // Add an item for every lookahead...

            for (l in lookaheads) {

              if (!used[j][l]) {
                added.push({ production: j, index: 0, lookahead: l });
                used[j][l] = true;
              }

            }

          }

        }

      }

      for (i = 0; i < added.length; i++)
        result.push(added[i]);

    } while (added.length > 0);

    return result;

  },

  // this is basically identical to the LR0 version...
  // could have a "copy" function for items?

  transitions: function(grammar, closure) {

    var result = {};
    var i;
    var item, symbol;
    var start = grammar.calculate("grammar.start");

    // For each item...

    for (i = 0; i < closure.length; i++) {

      item = closure[i];

      // Calculate the leaving symbol by looking in the grammar's productions,
      // handling the augmented grammar production as above.

      if (item.production === -1)
        symbol = [start][item.index];
      else
        symbol = grammar.productions[item.production][item.index + 1];

      // If there is a leaving symbol, add the next item.

      if (typeof symbol != "undefined") {

        if (!result[symbol])
          result[symbol] = [];

        // copy it!

        result[symbol].push({ production: item.production, index: item.index + 1, lookahead: item.lookahead });

      }

    }

    return result;

  },

  same: function(a, b) {

    var i, j;

    if (a.length !== b.length)
      return false;

    for (i = 0; i < a.length; i++) {

      for (j = 0; j < b.length; j++) {

        if (a[i].production === b[j].production && a[i].index === b[j].index && a[i].lookahead === b[j].lookahead)
          break;

      }

      if (j === b.length)
        return false;

    }

    return true;

  }

}

module.exports["parsing.lr.lr0_classification"] = function(grammar) {

  var i, s;
  var table = grammar.calculate("parsing.lr.lr0_table");
  var terminals = grammar.calculate("grammar.terminals");

  for (i = 0; i < table.length; i++) {

    if (table[i].reduce.length > 1)
      return { member: false, reason: "it contains a reduce-reduce conflict" };

    if (table[i].reduce.length > 0) {
      for (s in table[i].shift) {
        if (terminals[s])
          return { member: false, reason: "it contains a shift-reduce conflict" };
      }
    }

  }

  return { member: true };

}

module.exports["parsing.lr.lr0_automaton"] = function(grammar) {

  return automaton(grammar, lr0);

}

module.exports["parsing.lr.lr0_table"] = function(grammar) {

  var i, j, s;
  var state, item, actions;
  var table = [];
  var automaton = grammar.calculate("parsing.lr.lr0_automaton");

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = { shift: {}, reduce: [] };

    // add shift actions for transitions

    for (s in state.transitions)
      actions.shift[s] = state.transitions[s];

    // add reduce actions for completed items

    for (j = 0; j < state.items.length; j++) {

      item = state.items[j];

      if (item.production === -1) {
        if (item.index === 1)
          actions.reduce.push(item.production);
      } else {
        if (item.index == grammar.productions[item.production].length - 1)
          actions.reduce.push(item.production);
      }

    }

    table.push(actions);

  }

  return table;

}

function classifyLR1(table) {

  var i, s;

  for (i = 0; i < table.length; i++) {

    for (s in table[i]) {

      if (typeof table[i][s].reduce !== "undefined" && table[i][s].reduce.length > 1)
        return { member: false, reason: "it contains a reduce-reduce conflict" };

      if (typeof table[i][s].shift !== "undefined" && typeof table[i][s].reduce !== "undefined" && table[i][s].reduce.length > 0)
        return { member: false, reason: "it contains a shift-reduce conflict" };

    }

  }

  return { member: true };

}

function addReduceAction(actions, symbol, production) {

  if (typeof actions[symbol] === "undefined")
    actions[symbol] = { reduce: [] };

  if (typeof actions[symbol].reduce === "undefined")
    actions[symbol].reduce = [];

  actions[symbol].reduce.push(production);

}

module.exports["parsing.lr.slr1_classification"] = function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.slr1_table"));

}

module.exports["parsing.lr.slr1_table"] = function(grammar) {

  var i, j, s;
  var state, actions, item;
  var table = [];
  var automaton = grammar.calculate("parsing.lr.lr0_automaton");
  var follow = grammar.calculate("grammar.follow");

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = {};

    for (s in state.transitions)
      actions[s] = { shift: state.transitions[s] };

    for (j = 0; j < state.items.length; j++) {

      item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1)
          addReduceAction(actions, END, item.production);

      } else {

        if (item.index == grammar.productions[item.production].length - 1) {

          for (s in follow[grammar.productions[item.production][0]])
            addReduceAction(actions, s, item.production);

        }

      }

    }

    table.push(actions);

  }

  return table;

}

module.exports["parsing.lr.lr1_automaton"] = function(grammar) {

  return automaton(grammar, lr1);

}

module.exports["parsing.lr.lr1_classification"] = function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.lr1_table"));

}

module.exports["parsing.lr.lr1_table"] = function(grammar) {

  var i, j, s;
  var state, actions, item;
  var table = [];
  var automaton = grammar.calculate("parsing.lr.lr1_automaton");

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = {};

    for (s in state.transitions)
      actions[s] = { shift: state.transitions[s] };

    for (j = 0; j < state.items.length; j++) {

      item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1)
          addReduceAction(actions, END, item.production);

      } else {

        if (item.index == grammar.productions[item.production].length - 1)
          addReduceAction(actions, item.lookahead, item.production);

      }

    }

    table.push(actions);

  }

  return table;

}

// Collapse a list of LR1 items' lookaheads so that distinct
// items' lookaheads are arrays.

function collapseLookaheads(items) {

  var i, p, x, l;
  var table = {};

  for (i = 0; i < items.length; i++) {

    p = items[i].production;
    x = items[i].index;
    l = items[i].lookahead;

    if (!table[p])
      table[p] = [];

    if (!table[p][x])
      table[p][x] = [];

    table[p][x].push(l);

  }

  var result = [];

  for (p in table)
    for (x in table[p])
      result.push({ production: parseInt(p), index: parseInt(x), lookaheads: table[p][x] });

  return result;

}

// Return the union of the items in two LALR1 states.
// For each item in the first state, add lookaheads from the second state's corresponding items.

function mergeItems(a, b) {

  var result = [];
  var item;
  var i, j, k;

  for (i = 0; i < a.length; i++) {

    item = { production: a[i].production, index: a[i].index, lookaheads: [] };

    // Add lookaheads from a

    for (j = 0; j < a[i].lookaheads.length; j++)
      item.lookaheads.push(a[i].lookaheads[j]);

    // Find matching items in b and add their lookaheads if they aren't already present

    for (j = 0; j < b.length; j++) {

      if (b[j].production == a[i].production && b[j].index == a[i].index) {

        for (k = 0; k < b[j].lookaheads.length; k++) {
          if (item.lookaheads.indexOf(b[j].lookaheads[k]) === -1)
            item.lookaheads.push(b[j].lookaheads[k]);
        }

      }

    }

    result.push(item);

  }

  return result;

}

module.exports["parsing.lr.lalr1_classification"] = function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.lalr1_table"));

}

module.exports["parsing.lr.lalr1_automaton"] = function(grammar) {

  var i, j;

  // Get the LR1 automaton.

  var automaton = grammar.calculate("parsing.lr.lr1_automaton");

  // Collapse lookaheads.

  for (i = 0; i < automaton.length; i++) {

    automaton[i].kernel = collapseLookaheads(automaton[i].kernel);
    automaton[i].items = collapseLookaheads(automaton[i].items);

  }

  // Find states to merge.
  //
  // Produce a list like this:
  //
  //   merge = [[0], [1, 2], [3, 5], [4]]
  //
  // where merge[i] is a list of indices in the dfa that can be merged.
  //
  // states can be merged if they have the same items, not considering lookaheads.

  var used = [];
  var merge = [];

  for (i = 0; i < automaton.length; i++) {

    // If this state has been used already for merging, skip it.

    if (used[i])
      continue;

    // Otherwise, find the states (including the current state) which can be merged with it.

    var m = [];

    for (j = 0; j < automaton.length; j++) {

      if (!used[j] && lr0.same(automaton[i].kernel, automaton[j].kernel)) {

        m.push(j);
        used[j] = true;

      }

    }

    merge.push(m);

  }

  // for fixing transitions. looks like:
  //
  //   transition = [0, 1, 1, 3, 4, 3]
  //
  // where transition[i] is the new index for the original state i.

  var transition = [];

  for (i = 0; i < merge.length; i++) {
    for (j = 0; j < merge[i].length; j++) {

      transition[merge[i][j]] = i;

    }
  }

  // Produce new states

  var states = [];

  for (i = 0; i < merge.length; i++) {

    var state = { kernel: [], items: [], transitions: {} };

    // Merge items

    for (j = 0; j < merge[i].length; j++) {

      state.kernel = mergeItems(automaton[merge[i][j]].kernel, state.kernel);
      state.items = mergeItems(automaton[merge[i][j]].items, state.items);

    }

    // Add transitions (just use the first merge index)

    var original = automaton[merge[i][0]].transitions;
    var s;

    for (s in original)
      state.transitions[s] = transition[original[s]];

    // Add the new state

    states.push(state);

  }

  return states;

}

module.exports["parsing.lr.lalr1_table"] = function(grammar) {

  var i, j, k, s;
  var state, actions, item;
  var table = [];
  var automaton = grammar.calculate("parsing.lr.lalr1_automaton");

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = {};

    for (s in state.transitions)
      actions[s] = { shift: state.transitions[s] };

    for (j = 0; j < state.items.length; j++) {

      item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1)
          addReduceAction(actions, END, item.production);

      } else {

        if (item.index == grammar.productions[item.production].length - 1) {

          for (k = 0; k < item.lookaheads.length; k++)
            addReduceAction(actions, item.lookaheads[k], item.production);

        }

      }

    }

    table.push(actions);

  }

  return table;

}
