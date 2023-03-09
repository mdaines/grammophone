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

export default function({ getCalculation, automatonCalculation, title }) {
  const containerRef = useRef(null);

  const src = template({
    info: getCalculation("grammar.symbolInfo"),
    automaton: getCalculation(automatonCalculation),
    productions: getCalculation("grammar.productions"),
    start: getCalculation("grammar.start"),
    title: title
  });

  useEffect(() => {
    render(src)
      .then((element) => {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(element);
      });
  }, [src]);

  return <div ref={containerRef} />;
}
