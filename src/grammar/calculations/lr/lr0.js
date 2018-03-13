'use strict';

const automaton = require('./utils').automaton;
const kernelsEqual = require('./utils').kernelsEqual;

const build = {

  // What is the initial item?

  initial: function() {

    // production is an index into the grammar's list of productions,
    // index is the distinguished position in that production,
    // -1 is the production added by augmenting the grammar.

    return [ { production: -1, index: 0 } ];

  },

  // Given an item's kernel, find its epsilon closure of items.

  closure: function(grammar, kernel) {

    const start = grammar.calculate("grammar.start");
    const productions = grammar.calculate("grammar.productions");

    // Which items were added?

    let added;

    // Which productions have been used?

    let used = {};

    // Copy the kernel as the initial list of items

    let result = [];

    for (let i = 0; i < kernel.length; i++) {
      result.push({ production: kernel[i].production, index: kernel[i].index });
    }

    // While we cannot add more items...

    do {

      added = [];

      // For each item we have...

      for (let i = 0; i < result.length; i++) {

        // Find the nonterminal symbol...

        let item = result[i];

        // If the production is the augmented start production, we're looking
        // for the original start symbol. Otherwise, use the grammar's productions
        // to find the symbol, but add one to account for the left-hand side of
        // the production.

        let symbol;

        if (item.production === -1) {
          symbol = [start][item.index];
        } else {
          symbol = productions[item.production][item.index + 1];
        }

        // Find unused matching productions and add them.

        for (let j = 0; j < productions.length; j++) {

          if (!used[j] && productions[j][0] === symbol) {
            added.push({ production: j, index: 0 });
            used[j] = true;
          }

        }

      }

      for (let i = 0; i < added.length; i++) {
        result.push(added[i]);
      }

    } while (added.length > 0);

    return result;

  },

  // For the given list of (closure) items, return a map from symbol to kernel
  // representing the transitions that can be taken out of the
  // corresponding state.

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

        result[symbol].push({ production: item.production, index: item.index + 1 });

      }

    }

    return result;

  },

  // Are the two kernels equal?

  same: function(a, b) {
    return kernelsEqual(a, b, false);
  }

};

module.exports["parsing.lr.lr0_classification"] = function(grammar) {

  const table = grammar.calculate("parsing.lr.lr0_table");
  const terminals = grammar.calculate("grammar.terminals");

  for (let i = 0; i < table.length; i++) {

    if (table[i].reduce.length > 1) {
      return { member: false, reason: "it contains a reduce-reduce conflict" };
    }

    if (table[i].reduce.length > 0) {
      for (let s in table[i].shift) {
        if (terminals[s]) {
          return { member: false, reason: "it contains a shift-reduce conflict" };
        }
      }
    }

  }

  return { member: true };

};

module.exports["parsing.lr.lr0_automaton"] = function(grammar) {

  return automaton(grammar, build);

};

module.exports["parsing.lr.lr0_table"] = function(grammar) {

  let table = [];
  const automaton = grammar.calculate("parsing.lr.lr0_automaton");
  const productions = grammar.calculate("grammar.productions");

  for (let i = 0; i < automaton.length; i++) {

    let state = automaton[i];
    let actions = { shift: {}, reduce: [] };

    // add shift actions for transitions

    for (let s in state.transitions) {
      actions.shift[s] = state.transitions[s];
    }

    // add reduce actions for completed items

    for (let j = 0; j < state.items.length; j++) {

      let item = state.items[j];

      if (item.production === -1) {
        if (item.index === 1) {
          actions.reduce.push(item.production);
        }
      } else {
        if (item.index === productions[item.production].length - 1) {
          actions.reduce.push(item.production);
        }
      }

    }

    table.push(actions);

  }

  return table;

};
