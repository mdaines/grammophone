import { dotGraph } from "../src/dot_print.js";
import assert from "node:assert/strict";

describe("dotGraph", function() {
  it("returns a function that prints a graph in DOT format", function() {
    const printer = dotGraph();

    const result = printer({
      data: {},
      nodes: [
        { key: "a", data: {} },
        { key: "b", data: {} }
      ],
      edges: [
        { source: "a", target: "b", data: {} }
      ]
    });

    assert.deepStrictEqual(result, `digraph {\n  a;\n  b;\n  a -> b;\n}\n`);
  });

  it("prints literal attributes", function() {
    const printer = dotGraph();
    printer.attr("test", "123");
    printer.attr("blah", "!?");
    printer.node().attr("label", "abc");
    printer.edge().attr("color", "green");

    const result = printer({
      data: {},
      nodes: [],
      edges: []
    });

    assert.deepStrictEqual(result, `digraph {\n  graph [test=123, blah="!?"];\n  node [label=abc];\n  edge [color=green];\n}\n`);
  });

  it("escapes newlines and quotes", function() {
    const printer = dotGraph();
    printer.attr("test", "a\nb");
    printer.attr("blah", "it's an \"attribute\"");

    const result = printer({
      data: {},
      nodes: [],
      edges: []
    });

    assert.deepStrictEqual(result, `digraph {\n  graph [test="a\\nb", blah="it's an \\"attribute\\""];\n}\n`);
  });

  it("prints function attributes", function() {
    const printer = dotGraph();
    printer.attr("bgcolor", d => d.bgcolor);
    printer.node().attr("color", d => d.color);
    printer.node().attr("label", (d, g) => `${g.prefix}:${d.name}`);
    printer.edge().attr("color", d => d.color);
    printer.edge().attr("label", (d, g) => `${g.prefix}:${d.name}`);

    const result = printer({
      data: { bgcolor: "lightblue", prefix: "test" },
      nodes: [
        { key: "a", data: { color: "blue", name: "A" } },
        { key: "b", data: { color: "green", name: "B" } }
      ],
      edges: [
        { source: "a", target: "b", data: { color: "red", name: "E" } }
      ]
    });

    assert.deepStrictEqual(result, `digraph {\n  graph [bgcolor=lightblue];\n  a [color=blue, label="test:A"];\n  b [color=green, label="test:B"];\n  a -> b [color=red, label="test:E"];\n}\n`);
  });

  it("prints both function and literal attributes", function() {
    const printer = dotGraph();
    printer.attr("bgcolor", "lightblue");
    printer.attr("bgcolor", () => "lightgreen");
    printer.node().attr("color", "blue");
    printer.node().attr("color", () => "orange");
    printer.edge().attr("color", "green");
    printer.edge().attr("color", () => "yellow");

    const result = printer({
      data: {},
      nodes: [
        { key: "a", data: {} }
      ],
      edges: [
        { source: "a", target: "a", data: {} }
      ]
    });

    assert.deepStrictEqual(result, `digraph {\n  graph [bgcolor=lightblue, bgcolor=lightgreen];\n  node [color=blue];\n  edge [color=green];\n  a [color=orange];\n  a -> a [color=yellow];\n}\n`);
  });

  it("prints graph labels", function() {
    const printer = dotGraph();
    printer.label("test!");

    const result = printer({
      data: {},
      nodes: [],
      edges: []
    });

    assert.deepStrictEqual(result, `digraph "test!" {\n}\n`);
  });

  it("calls can be chained", function() {
    const printer = dotGraph()
      .label("test")
      .attr("test", "123")
      .attr("blah", "!?");

    printer.node()
      .attr("label", "abc")
      .attr("color", "blue");

    printer.edge()
      .attr("label", "def")
      .attr("color", "green");

    const result = printer({
      data: {},
      nodes: [],
      edges: []
    });

    assert.deepStrictEqual(result, `digraph test {\n  graph [test=123, blah="!?"];\n  node [label=abc, color=blue];\n  edge [label=def, color=green];\n}\n`);
  });

  it("can print an undirected graph", function() {
    const printer = dotGraph();
    printer.directed(false);

    const result = printer({
      data: {},
      nodes: [
        { key: "a", data: {} },
        { key: "b", data: {} }
      ],
      edges: [
        { source: "a", target: "b", data: {} }
      ]
    });

    assert.deepStrictEqual(result, `graph {\n  a;\n  b;\n  a -- b;\n}\n`);
  });

  it("can print a strict graph", function() {
    const printer = dotGraph();
    printer.strict(true);

    const result = printer({
      data: {},
      nodes: [],
      edges: []
    });

    assert.deepStrictEqual(result, `strict digraph {\n}\n`);
  });

  it("prints edges even if the nodes aren't defined in input", function() {
    const printer = dotGraph();

    const result = printer({
      data: {},
      nodes: [],
      edges: [
        { source: "a", target: "b", data: {} }
      ]
    });

    assert.deepStrictEqual(result, `digraph {\n  a -> b;\n}\n`);
  });
});
