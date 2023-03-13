import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("start", function() {
  it("returns the grammar's start symbol", function() {
    const grammar = new Grammar([
      ["A", "a", "B"],
      ["B", "b"]
    ]);

    assert.deepStrictEqual(grammar.calculations.start, "A");
  });
});
