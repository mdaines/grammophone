import { END } from "../../../symbols.js";
import { addReduceAction } from "./helpers.js";

export default function({ productions, lr0Automaton: automaton, symbolInfo }) {

  var i, j, s;
  var state, item, actions;
  var table = [];

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = {};

    // add shift actions for transitions

    for (s in state.transitions) {
      actions[s] = { shift: state.transitions[s] };
    }

    // add reduce actions for completed items

    for (s of symbolInfo.terminalOrder.concat(END)) {

      for (j = 0; j < state.items.length; j++) {

        item = state.items[j];

        if (item.production === -1) {
          if (item.index === 1) {
            addReduceAction(actions, s, item.production);
          }
        } else {
          if (item.index == productions[item.production].length - 1) {
            addReduceAction(actions, s, item.production);
          }
        }

      }

    }

    table.push(actions);

  }

  return table;

}
