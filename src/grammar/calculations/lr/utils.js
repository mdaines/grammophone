'use strict';

// Build an LR automaton for the grammar, using the provided "build" functions.

module.exports.automaton = function automaton(grammar, build) {
  
  let states = [ { kernel: build.initial() } ];
  
  // While no more states have been added... (outer loop)
  
  let s = 0;
  
  while (s < states.length) {
    
    // Process existing states... (inner loop)
    
    for (let l = states.length; s < l; s++) {
      
      let state = states[s];
      
      // Find the closure of the state's kernel
      
      state.items = build.closure(grammar, state.kernel);
      
      // Find the transitions out of the state (a map from symbol to kernel)
      
      let transitions = build.transitions(grammar, state.items);
      
      // Build the state's list of transitions...
      
      state.transitions = {};
      
      for (let symbol in transitions) {
        
        // Given a symbol and kernel in the transition map, find out if we've
        // already added the kernel as a state. If we have, assign that state's
        // index to the transition table for the symbol. If not, create a
        // new state.
        
        let kernel = transitions[symbol];
        
        let i;
        
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
  
};

module.exports.kernelsEqual = function kernelsEqual(a, b, checkLookahead) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) { 
    let j;
    
    for (j = 0; j < b.length; j++) {
      if (a[i].production === b[j].production && a[i].index === b[j].index && (!checkLookahead || a[i].lookahead === b[j].lookahead)) {
        break;
      }
    }
    
    if (j === b.length) {
      return false;
    }
  }

  return true;
};
