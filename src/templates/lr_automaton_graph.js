const Helpers = require('../helpers');

module.exports = function(input) {
  let info = input.info;
  let automaton = input.automaton;
  let productions = input.productions;
  let start = input.start;
  let title = input.title;

  let result = [];

  result.push(
    "digraph \"",
    title,
    "\" {\n  graph [rankdir=LR];\n  node [shape=record];\n"
  );

  automaton.forEach(function(state, index) {
    result.push(
      "  s",
      index,
      " [label=\"",
      index,
      " | ",
      state.items.map(function(item) { return Helpers.bareFormatItem(item, start, productions, info); }).join("\\n"),
      "\"];\n"
    );
  });

  automaton.forEach(function(state, index) {
    var s;
    for (s in state.transitions) {
      result.push(
        "  s",
        index,
        " -> s",
        state.transitions[s],
        " [label=\"",
        Helpers.bareFormatSymbol(s, input.info),
        "\"];\n"
      );
    }
  });

  result.push("}\n");

  return result.join("");
}
