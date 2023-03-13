import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("symbolInfo", function() {
  it("returns symbol orderings and the sets of nonterminal and terminal symbols", function() {
    const grammar = new Grammar([
      ["A", "C"],
      ["A", "a", "B"],
      ["B", "b"],
      ["C", "B"],
      ["C", "c"]
    ]);

    assert.deepStrictEqual(grammar.calculations.symbolInfo, {
      terminalOrder: ["a", "b", "c"],
      nonterminalOrder: ["A", "C", "B"],
      productionOrder: ["A", "B", "C"],
      nonterminals: new Set(["A", "B", "C"]),
      terminals: new Set(["a", "b", "c"])
    });
  });
});
