export default function(grammar) {

  var i, j, s;
  var state, item, actions;
  var table = [];
  var automaton = grammar.calculate("parsing.lr.lr0_automaton");

  for (i = 0; i < automaton.length; i++) {

    state = automaton[i];
    actions = { shift: {}, reduce: [] };

    // add shift actions for transitions

    for (s in state.transitions) {
      actions.shift[s] = state.transitions[s];
    }

    // add reduce actions for completed items

    for (j = 0; j < state.items.length; j++) {

      item = state.items[j];

      if (item.production === -1) {
        if (item.index === 1) {
          actions.reduce.push(item.production);
        }
      } else {
        if (item.index == grammar.productions[item.production].length - 1) {
          actions.reduce.push(item.production);
        }
      }

    }

    table.push(actions);

  }

  return table;

}
