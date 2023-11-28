import { bareFormatItem, bareFormatSymbol } from "../../helpers.js";
import VizComponent from "./viz_component.jsx";

function isConflict(state) {
  for (const s in state) {
    if ((typeof state[s].shift === "undefined" ? 0 : 1) + (typeof state[s].reduce !== "undefined" ? state[s].reduce.length : 0) > 1) {
      return true;
    }
  }

  return false;
}

function transform(grammar, automaton, table) {
  const { start, productions, symbolInfo } = grammar.calculations;

  return {
    graphAttributes: {
      rankdir: "LR"
    },
    nodeAttributes: {
      shape: "record",
      style: "filled"
    },
    nodes: automaton.map((state, index) => {
      return {
        name: index,
        attributes: {
          label: `${index} | ${state.items.map(item => bareFormatItem(item, start, productions, symbolInfo)).join("\\n")}`,
          fillcolor: isConflict(table[index]) ? "#fdd" : "#fff"
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

export default function({ grammar, automaton, table }) {
  return <VizComponent src={transform(grammar, automaton, table)} />;
}
