import { bareFormatItem, bareFormatSymbol } from "../../helpers.js";
import VizComponent from "./viz_component.jsx";

function transform(grammar, automaton) {
  const { start, productions, symbolInfo } = grammar.calculations;

  return {
    graphAttributes: {
      rankdir: "LR"
    },
    nodeAttributes: {
      shape: "record"
    },
    nodes: automaton.map((state, index) => {
      return {
        name: index,
        attributes: {
          label: `${index} | ${state.items.map(item => bareFormatItem(item, start, productions, symbolInfo)).join("\\n")}`
        }
      };
    }),
    edges: automaton.flatMap((state, tail) => {
      return Object.entries(state.transitions).map(([symbol, head]) => {
        return {
          tail,
          head,
          attributes: {
            label: bareFormatSymbol(symbol, symbolInfo)
          }
        };
      });
    })
  };
}

export default function({ grammar, automaton }) {
  return <VizComponent src={transform(grammar, automaton)} />;
}
