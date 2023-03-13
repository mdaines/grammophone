import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("cycle", function() {
  it("detects a cycle", function() {
    const grammar = new Grammar([
      ["A", "a"],
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    assert.deepStrictEqual(grammar.calculations.cycle, ["A", "B", "C", "A"]);
  });

  it("returns undefined if there is no cycle", function() {
    const grammar = new Grammar([
      ["A", "a"]
    ]);

    assert.deepStrictEqual(grammar.calculations.cycle, undefined);
  });
});
