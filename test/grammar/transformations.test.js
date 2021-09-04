const Grammar = require("../../src/grammar");

describe("transformations.epsilonSeparate", function() {
  it("returns the expected result", function() {
    let productions = [
      ["A", "a"],
      ["A"]
    ];

    let grammar = new Grammar(productions);
    expect(grammar.calculate("transformations.epsilonSeparate")).toEqual([
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
    let productions = [
      ["A"]
    ];

    let grammar = new Grammar(productions);
    expect(grammar.calculate("transformations.epsilonSeparate")).toEqual([]);
  });
});
