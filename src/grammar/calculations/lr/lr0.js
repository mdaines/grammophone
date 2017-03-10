const automaton = require('./utils').automaton;
const kernelsEqual = require('./utils').kernelsEqual;

var build = {

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
    return kernelsEqual(a, b, false);
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
  
  return automaton(grammar, build);
  
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
