import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("expandTransformation", function() {
  it("returns the expected result", function() {
    const grammar = new Grammar([
      ["A", "A", "a"],
      ["A"]
    ]);

    assert.deepStrictEqual(grammar.calculations.expandTransformation, [
      {
        name: "expand",
        production: 0,
        symbol: 1,
        changes: [
          {
            operation: "delete",
            index: 0
          },
          {
            operation: "insert",
            index: 0,
            production: ["A", "A", "a", "a"],
          },
          {
            operation: "insert",
            index: 1,
            production: ["A", "a"],
          }
        ]
      }
    ]);
  });
});
