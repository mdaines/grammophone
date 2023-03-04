import { END } from "../../../../symbols.js";

export default {

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

    for (i = 0; i < grammar.productions.length; i++) {
      used[i] = {};
    }

    // Copy the kernel as the initial list of items

    var result = [];

    for (i = 0; i < kernel.length; i++) {
      result.push({ production: kernel[i].production, index: kernel[i].index, lookahead: kernel[i].lookahead });
    }

    // While we cannot add more items...

    do {

      added = [];

      // For each item we have...

      for (i = 0; i < result.length; i++) {

        item = result[i];

        // Find the nonterminal symbol...

        // Find the stuff "after the dot" (taking into account the augmented grammar)

        if (item.production === -1) {
          remaining = [start].slice(item.index);
        } else {
          remaining = grammar.productions[item.production].slice(item.index + 1);
        }

        // Go to next item if this one is completed

        if (remaining.length == 0) {
          continue;
        }

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

            for (l of lookaheads) {

              if (!used[j][l]) {
                added.push({ production: j, index: 0, lookahead: l });
                used[j][l] = true;
              }

            }

          }

        }

      }

      for (i = 0; i < added.length; i++) {
        result.push(added[i]);
      }

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

      if (item.production === -1) {
        symbol = [start][item.index];
      } else {
        symbol = grammar.productions[item.production][item.index + 1];
      }

      // If there is a leaving symbol, add the next item.

      if (typeof symbol != "undefined") {

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

    var i, j;

    if (a.length !== b.length) {
      return false;
    }

    for (i = 0; i < a.length; i++) {

      for (j = 0; j < b.length; j++) {

        if (a[i].production === b[j].production && a[i].index === b[j].index && a[i].lookahead === b[j].lookahead) {
          break;
        }

      }

      if (j === b.length) {
        return false;
      }

    }

    return true;

  }

}
