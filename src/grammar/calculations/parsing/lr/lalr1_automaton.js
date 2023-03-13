import { collapseLookaheads, mergeItems } from "./helpers.js";
import * as build from "./build/lr0.js";

export default function({ lr1Automaton }) {

  var i, j;

  // Get the LR1 automaton.

  const automaton = lr1Automaton;

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

    if (used[i]) {
      continue;
    }

    // Otherwise, find the states (including the current state) which can be merged with it.

    var m = [];

    for (j = 0; j < automaton.length; j++) {

      if (!used[j] && build.same(automaton[i].kernel, automaton[j].kernel)) {

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

    for (s in original) {
      state.transitions[s] = transition[original[s]];
    }

    // Add the new state

    states.push(state);

  }

  return states;

}
