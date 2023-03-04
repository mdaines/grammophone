import { bareFormatItem, bareFormatSymbol } from "../../helpers.js";

export default function({ info, automaton, productions, start, title }) {
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
      state.items.map(function(item) { return bareFormatItem(item, start, productions, info); }).join("\\n"),
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
        bareFormatSymbol(s, info),
        "\"];\n"
      );
    }
  });

  result.push("}\n");

  return result.join("");
}
