import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("removeImmediateLeftRecursionTransformation", function() {
  it("returns the expected result", function() {
    const grammar = new Grammar([
      ["A", "A"],
      ["A", "a"]
    ]);

    assert.deepStrictEqual(grammar.calculations.removeImmediateLeftRecursionTransformation, [
      {
        name: "removeImmediateLeftRecursion",
        production: 0,
        symbol: 0,
        changes: [
          {
            operation: "delete",
            index: 0
          },
          {
            operation: "delete",
            index: 0
          },
          {
            operation: "insert",
            index: 0,
            production: ["A", "a", "A2"],
          },
          {
            operation: "insert",
            index: 1,
            production: ["A2", "A2"],
          },
          {
            operation: "insert",
            index: 2,
            production: ["A2"],
          }
        ]
      }
    ]);
  });
});
