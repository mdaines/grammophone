import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("epsilonSeparateTransformation", function() {
  it("returns the expected result", function() {
    const grammar = new Grammar([
      ["A", "a"],
      ["A"]
    ]);

    assert.deepStrictEqual(grammar.calculations.epsilonSeparateTransformation, [
      {
        name: "epsilonSeparate",
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
            production: ["A", "A2"],
          },
          {
            operation: "insert",
            index: 1,
            production: ["A"],
          },
          {
            operation: "insert",
            index: 2,
            production: ["A2", "a"],
          }
        ]
      }
    ]);
  });

  it("result is empty when a nonterminal only produces epsilon", function() {
    const grammar = new Grammar([
      ["A"]
    ]);

    assert.deepStrictEqual(grammar.calculations.epsilonSeparateTransformation, []);
  });
});
