import { bareFormatItem, bareFormatSymbol } from "../../helpers.js";
import { dotGraph } from "../../../dot_print.js";
import VizComponent from "./viz_component.jsx";

function transform(grammar, automaton) {
  return {
    data: grammar.calculations,
    nodes: automaton.map((state, index) => {
      return { key: index, data: { ...state, index } };
    }),
    edges: automaton.flatMap((state, source) => {
      return Object.entries(state.transitions).map(([symbol, target]) => {
        return { source, target, data: { symbol } };
      });
    })
  };
}

const automatonGraph = dotGraph()
  .attr("rankdir", "LR");

automatonGraph.node()
  .attr("label", ({ index, items }, { start, productions, symbolInfo }) => {
    return `${index} | ${items.map(item => bareFormatItem(item, start, productions, symbolInfo)).join("\n")}`;
  })
  .attr("shape", "record");

automatonGraph.edge()
  .attr("label", ({ symbol }, { symbolInfo }) => bareFormatSymbol(symbol, symbolInfo));

export default function({ grammar, automaton }) {
  const src = automatonGraph(transform(grammar, automaton));

  return <VizComponent src={src} />;
}
