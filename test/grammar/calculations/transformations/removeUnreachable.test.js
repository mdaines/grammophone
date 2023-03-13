import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("removeUnreachableTransformation", function() {
  it("returns the expected result", function() {
    const grammar = new Grammar([
      ["A", "a"],
      ["B"],
      ["B", "b"]
    ]);

    assert.deepStrictEqual(grammar.calculations.removeUnreachableTransformation, [
      {
        name: "removeUnreachable",
        production: 1,
        symbol: 0,
        changes: [
          {
            operation: "delete",
            index: 1
          },
          {
            operation: "delete",
            index: 1
          }
        ]
      }
    ]);
  });
});
