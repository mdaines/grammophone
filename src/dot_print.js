const skipQuotePattern = /^([A-Za-z_][A-Za-z_0-9]*|-?(\.[0-9]+|[0-9]+(\.[0-9]+)?))$/;

function quote(value) {
  const str = String(value);

  if (skipQuotePattern.test(str)) {
    return str;
  } else {
    return "\"" + str.replaceAll("\"", "\\\"").replaceAll("\n", "\\n") + "\"";
  }
}

export function dotEdge() {
  let functionAttrs = [], literalAttrs = [];

  function dotEdge(directed, source, target, data, graphData) {
    const result = [];

    result.push(quote(source), " ")

    if (directed) {
      result.push("->");
    } else {
      result.push("--");
    }

    result.push(" ", quote(target));

    if (functionAttrs.length > 0) {
      result.push(" [");

      functionAttrs.forEach(([k, v], i) => {
        if (i > 0) {
          result.push(", ");
        }
        result.push(quote(k), "=", quote(v(data, graphData)));
      });

      result.push("]");
    }

    return result.join("");
  }

  dotEdge.literalAttrs = literalAttrs;

  dotEdge.attr = function(k, v) {
    const attrs = typeof v === "function" ? functionAttrs : literalAttrs;
    return (attrs.push([k, v]), dotEdge);
  }

  return dotEdge;
}

export function dotNode() {
  let functionAttrs = [], literalAttrs = [];

  function dotNode(name, data, graphData) {
    const result = [];

    result.push(quote(name));

    if (functionAttrs.length > 0) {
      result.push(" [");

      functionAttrs.forEach(([k, v], i) => {
        if (i > 0) {
          result.push(", ");
        }
        result.push(quote(k), "=", quote(v(data, graphData)));
      });

      result.push("]");
    }

    return result.join("");
  }

  dotNode.literalAttrs = literalAttrs;

  dotNode.attr = function(k, v) {
    const attrs = typeof v === "function" ? functionAttrs : literalAttrs;
    return (attrs.push([k, v]), dotNode);
  }

  return dotNode;
}

export function dotGraph() {
  let strict = false, directed = true, label, attrs = [], node = dotNode(), edge = dotEdge();

  function dotGraph(graph) {
    const result = [];

    if (strict) {
      result.push("strict", " ");
    }

    if (directed) {
      result.push("digraph");
    } else {
      result.push("graph");
    }

    result.push(" ");

    if (typeof label === "function") {
      result.push(quote(label(graph.data)), " ");
    } else if (typeof label !== "undefined") {
      result.push(quote(label), " ");
    }

    result.push("{\n");

    // graph attrs

    if (attrs.length > 0) {
      result.push("  graph", " [");

      attrs.forEach(([k, v], i) => {
        if (i) {
          result.push(", ");
        }
        if (typeof v === "function") {
          v = v(graph.data);
        }
        result.push(quote(k), "=", quote(v));
      });

      result.push("];\n");
    }

    // node literal attrs

    if (node.literalAttrs.length > 0) {
      result.push("  node", " [");

      node.literalAttrs.forEach(([k, v], i) => {
        if (i) {
          result.push(", ");
        }
        result.push(quote(k), "=", quote(v));
      });

      result.push("];\n");
    }

    // edge literal attrs

    if (edge.literalAttrs.length > 0) {
      result.push("  edge", " [");

      edge.literalAttrs.forEach(([k, v], i) => {
        if (i) {
          result.push(", ");
        }
        result.push(quote(k), "=", quote(v));
      });

      result.push("];\n");
    }

    // nodes

    graph.nodes.forEach(({ key, data }) => {
      result.push("  ", node(key, data, graph.data), ";\n");
    });

    // edges

    graph.edges.forEach(({ source, target, data }) => {
      result.push("  ", edge(directed, source, target, data, graph.data), ";\n");
    });

    result.push("}\n");

    return result.join("");
  }

  dotGraph.strict = function(v) {
    return arguments.length ? (strict = v, dotGraph) : strict;
  }

  dotGraph.directed = function(v) {
    return arguments.length ? (directed = v, dotGraph) : directed;
  }

  dotGraph.label = function(v) {
    return arguments.length ? (label = v, dotGraph) : label;
  }

  dotGraph.attr = function(k, v) {
    return (attrs.push([k, v]), dotGraph);
  }

  dotGraph.node = function(v) {
    return arguments.length ? (node = v, dotGraph) : node;
  }

  dotGraph.edge = function(v) {
    return arguments.length ? (edge = v, dotGraph) : edge;
  }

  return dotGraph;
}
