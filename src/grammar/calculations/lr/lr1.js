'use strict';

const automaton = require('./utils').automaton;
const kernelsEqual = require('./utils').kernelsEqual;
const END = require('../../symbols').END;

const build = {

  initial: function() {

    return [ { production: -1, index: 0, lookahead: END } ];

  },

  closure: function(grammar, kernel) {

    const start = grammar.calculate("grammar.start");
    const productions = grammar.calculate("grammar.productions");

    // Which items were added in a given iteration?

    let added;

    // Which productions/lookaheads have we already used for the closure?

    let used = {};

    for (let i = 0; i < productions.length; i++) {
      used[i] = {};
    }

    // Copy the kernel as the initial list of items

    let result = [];

    for (let i = 0; i < kernel.length; i++) {
      result.push({ production: kernel[i].production, index: kernel[i].index, lookahead: kernel[i].lookahead });
    }

    // While we cannot add more items...

    do {

      added = [];

      // For each item we have...

      for (let i = 0; i < result.length; i++) {

        let item = result[i];

        // Find the nonterminal symbol...

        // Find the stuff "after the dot" (taking into account the augmented grammar)

        let remaining;

        if (item.production === -1) {
          remaining = [start].slice(item.index);
        } else {
          remaining = productions[item.production].slice(item.index + 1);
        }

        // Go to next item if this one is completed

        if (remaining.length === 0) {
          continue;
        }

        // the nonterminal symbol is the first thing after the dot

        let symbol = remaining[0];

        // lookaheads
        // first(gamma a) where the item is [A -> alpha . B gamma, a]

        let lookaheads = grammar.getFirst(remaining.slice(1).concat(item.lookahead));

        // Add items for matching productions/lookaheads (which are not already
        // used for the closure)

        for (let j = 0; j < productions.length; j++) {

          if (productions[j][0] === symbol) {

            // Add an item for every lookahead...

            for (let l in lookaheads) {

              if (!used[j][l]) {
                added.push({ production: j, index: 0, lookahead: l });
                used[j][l] = true;
              }

            }

          }

        }

      }

      for (let i = 0; i < added.length; i++) {
        result.push(added[i]);
      }

    } while (added.length > 0);

    return result;

  },

  // this is basically identical to the LR0 version...
  // could have a "copy" function for items?

  transitions: function(grammar, closure) {

    let result = {};
    const start = grammar.calculate("grammar.start");
    const productions = grammar.calculate("grammar.productions");

    // For each item...

    for (let i = 0; i < closure.length; i++) {

      let item = closure[i];

      // Calculate the leaving symbol by looking in the grammar's productions,
      // handling the augmented grammar production as above.

      let symbol;

      if (item.production === -1) {
        symbol = [start][item.index];
      } else {
        symbol = productions[item.production][item.index + 1];
      }

      // If there is a leaving symbol, add the next item.

      if (typeof symbol !== "undefined") {

        if (!result[symbol]) {
          result[symbol] = [];
        }

        // copy it!

        result[symbol].push({ production: item.production, index: item.index + 1, lookahead: item.lookahead });

      }

    }

    return result;

  },

  same: function(a, b) {
    return kernelsEqual(a, b, true);
  }

};

function classifyLR1(table) {

  for (let i = 0; i < table.length; i++) {

    for (let s in table[i]) {

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

function addReduceAction(actions, symbol, production) {

  if (typeof actions[symbol] === "undefined") {
    actions[symbol] = { reduce: [] };
  }

  if (typeof actions[symbol].reduce === "undefined") {
    actions[symbol].reduce = [];
  }

  actions[symbol].reduce.push(production);

}

module.exports["parsing.lr.slr1_classification"] = function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.slr1_table"));

};

module.exports["parsing.lr.slr1_table"] = function(grammar) {

  let table = [];
  const automaton = grammar.calculate("parsing.lr.lr0_automaton");
  const follow = grammar.calculate("grammar.follow");
  const productions = grammar.calculate("grammar.productions");

  for (let i = 0; i < automaton.length; i++) {

    let state = automaton[i];
    let actions = {};

    for (let s in state.transitions) {
      actions[s] = { shift: state.transitions[s] };
    }

    for (let j = 0; j < state.items.length; j++) {

      let item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1) {
          addReduceAction(actions, END, item.production);
        }

      } else {

        if (item.index === productions[item.production].length - 1) {

          for (let s in follow[productions[item.production][0]]) {
            addReduceAction(actions, s, item.production);
          }

        }

      }

    }

    table.push(actions);

  }

  return table;

};

module.exports["parsing.lr.lr1_automaton"] = function(grammar) {

  return automaton(grammar, build);

};

module.exports["parsing.lr.lr1_classification"] = function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.lr1_table"));

};

module.exports["parsing.lr.lr1_table"] = function(grammar) {

  let table = [];
  const automaton = grammar.calculate("parsing.lr.lr1_automaton");
  const productions = grammar.calculate("grammar.productions");

  for (let i = 0; i < automaton.length; i++) {

    let state = automaton[i];
    let actions = {};

    for (let s in state.transitions) {
      actions[s] = { shift: state.transitions[s] };
    }

    for (let j = 0; j < state.items.length; j++) {

      let item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1) {
          addReduceAction(actions, END, item.production);
        }

      } else {

        if (item.index === productions[item.production].length - 1) {
          addReduceAction(actions, item.lookahead, item.production);
        }

      }

    }

    table.push(actions);

  }

  return table;

};

// Collapse a list of LR1 items' lookaheads so that distinct
// items' lookaheads are arrays.

function collapseLookaheads(items) {

  let table = {};

  for (let i = 0; i < items.length; i++) {

    let p = items[i].production;
    let x = items[i].index;
    let l = items[i].lookahead;

    if (!table[p]) {
      table[p] = [];
    }

    if (!table[p][x]) {
      table[p][x] = [];
    }

    table[p][x].push(l);

  }

  let result = [];

  for (let p in table) {
    for (let x in table[p]) {
      result.push({ production: parseInt(p), index: parseInt(x), lookaheads: table[p][x] });
    }
  }

  return result;

}

// Return the union of the items in two LALR1 states.
// For each item in the first state, add lookaheads from the second state's corresponding items.

function mergeItems(a, b) {

  let result = [];

  for (let i = 0; i < a.length; i++) {

    let item = { production: a[i].production, index: a[i].index, lookaheads: [] };

    // Add lookaheads from a

    for (let j = 0; j < a[i].lookaheads.length; j++) {
      item.lookaheads.push(a[i].lookaheads[j]);
    }

    // Find matching items in b and add their lookaheads if they aren't already present

    for (let j = 0; j < b.length; j++) {

      if (b[j].production === a[i].production && b[j].index === a[i].index) {

        for (let k = 0; k < b[j].lookaheads.length; k++) {
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

module.exports["parsing.lr.lalr1_classification"] = function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.lalr1_table"));

};

module.exports["parsing.lr.lalr1_automaton"] = function(grammar) {

  // Get the LR1 automaton.

  const automaton = grammar.calculate("parsing.lr.lr1_automaton");

  // Collapse lookaheads.

  for (let i = 0; i < automaton.length; i++) {

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

  let used = [];
  let merge = [];

  for (let i = 0; i < automaton.length; i++) {

    // If this state has been used already for merging, skip it.

    if (used[i]) {
      continue;
    }

    // Otherwise, find the states (including the current state) which can be merged with it.

    let m = [];

    for (let j = 0; j < automaton.length; j++) {

      if (!used[j] && kernelsEqual(automaton[i].kernel, automaton[j].kernel, false)) {

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

  let transition = [];

  for (let i = 0; i < merge.length; i++) {
    for (let j = 0; j < merge[i].length; j++) {

      transition[merge[i][j]] = i;

    }
  }

  // Produce new states

  let states = [];

  for (let i = 0; i < merge.length; i++) {

    let state = { kernel: [], items: [], transitions: {} };

    // Merge items

    for (let j = 0; j < merge[i].length; j++) {

      state.kernel = mergeItems(automaton[merge[i][j]].kernel, state.kernel);
      state.items = mergeItems(automaton[merge[i][j]].items, state.items);

    }

    // Add transitions (just use the first merge index)

    let original = automaton[merge[i][0]].transitions;

    for (let s in original) {
      state.transitions[s] = transition[original[s]];
    }

    // Add the new state

    states.push(state);

  }

  return states;

};

module.exports["parsing.lr.lalr1_table"] = function(grammar) {

  let table = [];
  const automaton = grammar.calculate("parsing.lr.lalr1_automaton");
  const productions = grammar.calculate("grammar.productions");

  for (let i = 0; i < automaton.length; i++) {

    let state = automaton[i];
    let actions = {};

    for (let s in state.transitions) {
      actions[s] = { shift: state.transitions[s] };
    }

    for (let j = 0; j < state.items.length; j++) {

      let item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1) {
          addReduceAction(actions, END, item.production);
        }

      } else {

        if (item.index === productions[item.production].length - 1) {

          for (let k = 0; k < item.lookaheads.length; k++) {
            addReduceAction(actions, item.lookaheads[k], item.production);
          }

        }

      }

    }

    table.push(actions);

  }

  return table;

};
