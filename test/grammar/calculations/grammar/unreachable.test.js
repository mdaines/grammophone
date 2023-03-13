import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("unreachable", function() {
  it("returns the set of unreachable nonterminals", function() {
    const grammar = new Grammar([
      ["A", "B"],
      ["B", "b"],
      ["C", "A"],
      ["D", "A"]
    ]);

    assert.deepStrictEqual(grammar.calculations.unreachable, new Set(["C", "D"]));
  });
});
