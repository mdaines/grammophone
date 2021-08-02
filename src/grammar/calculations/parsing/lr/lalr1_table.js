var addReduceAction = require("./helpers").addReduceAction;
var END = require("../../../symbols").END;

module.exports = function(grammar) {

  var i, j, k, s;
  var state, actions, item;
  var table = [];
  var automaton = grammar.calculate("parsing.lr.lalr1_automaton");

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

        if (item.index == grammar.productions[item.production].length - 1) {

          for (k = 0; k < item.lookaheads.length; k++) {
            addReduceAction(actions, item.lookaheads[k], item.production);
          }

        }

      }

    }

    table.push(actions);

  }

  return table;

}
