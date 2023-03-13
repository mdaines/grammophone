import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("enable", function() {
  it("returns set of enable nonterminals", function() {
    const grammar = new Grammar([
      ["A", "B", "a"],
      ["B", "C", "b"],
      ["B", "C"],
      ["C"]
    ]);

    assert.deepStrictEqual(grammar.calculations.endable, new Set(["A"]));
  });
});
