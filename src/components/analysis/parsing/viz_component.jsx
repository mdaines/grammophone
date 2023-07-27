import { useRef, useEffect } from "react";

let vizPromise;

function render(src) {
  if (typeof vizPromise === "undefined") {
    vizPromise = import("@viz-js/viz").then(m => m.instance());
  }

  return vizPromise
    .then(viz => viz.renderSVGElement(src))
    .catch(error => document.createTextNode(error.toString()));
}

export default function({ src }) {
  const containerRef = useRef(null);

  useEffect(() => {
    render(src)
      .then(element => {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(element);
      });
  }, [src]);

  return <div ref={containerRef} />;
}
