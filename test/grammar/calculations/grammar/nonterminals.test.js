import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("nonterminals", function() {
  it("returns the set of the grammar's nonterminal symbols", function() {
    const grammar = new Grammar([
      ["A", "a", "B", "b"],
      ["B", "A"],
      ["B"],
      ["C", "x"]
    ]);

    assert.deepStrictEqual(grammar.calculations.nonterminals, new Set(["A", "B", "C"]));
  });
});
