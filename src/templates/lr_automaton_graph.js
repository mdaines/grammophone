const Helpers = require('../helpers');

module.exports = function(input) {
  let result = [];

  result.push(
    "digraph \"",
    input.title,
    "\" {\n  graph [rankdir=LR];\n  node [shape=record];\n"
  );

  input.automaton.forEach(function(state, index) {
    result.push(
      "  s",
      index,
      " [label=\"",
      index,
      " | ",
      state.items.map(function(item) { return Helpers.bareFormatItem(item, input.start, input.productions, input.info); }).join("\\n"),
      "\"];\n"
    );
  });

  input.automaton.forEach(function(state, index) {
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
