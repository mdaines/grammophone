import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("unrealizable", function() {
  it("returns the set of unrealizable nonterminals", function() {
    const grammar = new Grammar([
      ["A", "B"],
      ["B", "y", "B"]
    ]);

    assert.deepStrictEqual(grammar.calculations.unrealizable, new Set(["A", "B"]));
  });
});
