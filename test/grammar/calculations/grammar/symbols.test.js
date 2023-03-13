import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("symbols", function() {
  it("returns the set of the grammar's symbols", function() {
    const grammar = new Grammar([
      ["A", "a", "B", "b"],
      ["B", "A"],
      ["B"],
      ["C", "x"]
    ]);

    assert.deepStrictEqual(grammar.calculations.symbols, new Set(["A", "a", "B", "b", "C", "x"]));
  });
});
