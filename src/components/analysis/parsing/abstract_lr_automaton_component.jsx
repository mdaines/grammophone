import template from "./lr_automaton_graph.js";
import { useRef, useEffect } from "react";

let viz;

function render(src) {
  if (typeof viz === "undefined") {
    viz = new Viz();
  }

  return viz.renderSVGElement(src)
    .catch((error) => {
      viz = undefined;

      return document.createTextNode(error.toString());
    });
}

export default function({ grammar, automaton, title }) {
  const { productions, symbolInfo, start } = grammar.calculations;
  const src = template({
    symbolInfo,
    automaton,
    productions,
    start,
    title
  });
  const containerRef = useRef(null);

  useEffect(() => {
    render(src)
      .then((element) => {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(element);
      });
  }, [src]);

  return <div ref={containerRef} />;
}
