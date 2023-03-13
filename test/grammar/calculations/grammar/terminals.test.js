import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("terminals", function() {
  it("returns the set of the grammar's terminal symbols", function() {
    const grammar = new Grammar([
      ["A", "a", "B", "b"],
      ["B", "A"],
      ["B"],
      ["C", "x"]
    ]);

    assert.deepStrictEqual(grammar.calculations.terminals, new Set(["a", "b", "x"]));
  });
});
