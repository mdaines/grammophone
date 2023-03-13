import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("leftFactorTransformation", function() {
  it("returns the expected result", function() {
    const grammar = new Grammar([
      ["A", "a", "A"],
      ["A", "a"]
    ]);

    assert.deepStrictEqual(grammar.calculations.leftFactorTransformation, [
      {
        name: "leftFactor",
        production: 0,
        symbol: 0,
        length: 1,
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
            production: ["A2", "A"],
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
