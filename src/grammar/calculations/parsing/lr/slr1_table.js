import { END } from "../../../symbols.js";
import { addReduceAction } from "./helpers.js";

export default function({ productions, lr0Automaton: automaton, follow }) {

  var i, j, s;
  var state, actions, item;
  var table = [];

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = {};

    for (s in state.transitions) {
      actions[s] = { shift: state.transitions[s] };
    }

    for (j = 0; j < state.items.length; j++) {

      item = state.items[j];

      if (item.production === -1) {

        if (item.index === 1) {
          addReduceAction(actions, END, item.production);
        }

      } else {

        if (item.index == productions[item.production].length - 1) {

          for (s of follow.get(productions[item.production][0])) {
            addReduceAction(actions, s, item.production);
          }

        }

      }

    }

    table.push(actions);

  }

  return table;

}
