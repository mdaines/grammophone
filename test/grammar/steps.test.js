const Grammar = require("../../src/grammar");

function calculateSteps(grammar) {
  let nonterminals = grammar.calculate("grammar.nonterminals");

  let symbolCounts = new Map();
  let productionCounts = new Map();

  while (productionCounts.size < grammar.productions.length) {
    let size = productionCounts.size;

    for (let i = 0; i < grammar.productions.length; i++) {
      let steps = 1;

      let j;

      for (j = 1; j < grammar.productions[i].length; j++) {
        let s = grammar.productions[i][j];

        if (symbolCounts.has(s)) {
          steps += symbolCounts.get(s);
        } else if (nonterminals.has(s)) {
          break;
        }
      }

      if (j == grammar.productions[i].length) {
        let h = grammar.productions[i][0];

        if (!symbolCounts.has(h)) {
          symbolCounts.set(h, steps);
        }

        productionCounts.set(i, steps);
      }
    }

    if (size == productionCounts.size) {
      return undefined;
    }
  }

  let result = new Array(grammar.productions.length);

  for (let i = 0; i < grammar.productions.length; i++) {
    result[i] = productionCounts.get(i);
  }

  return result;
}

describe("steps", function() {
  it("simple grammar", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);

    expect(calculateSteps(grammar)).toEqual([
      2,
      1
    ]);
  });

  it("recursion", function() {
    let grammar = new Grammar([
      ["B", "z", "B"],
      ["B", "u"]
    ]);

    expect(calculateSteps(grammar)).toEqual([
      2,
      1
    ]);
  });

  it("multiple nonterminals and recursion", function() {
    let grammar = new Grammar([
      ["A", "y", "B"],
      ["A", "x"],
      ["A", "B", "C"],
      ["B", "z", "B"],
      ["B", "u"],
      ["C", "s"]
    ]);

    expect(calculateSteps(grammar)).toEqual([
      2,
      1,
      3,
      2,
      1,
      1
    ]);
  });

  it("multiple steps", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "x"]
    ]);

    expect(calculateSteps(grammar)).toEqual([
      3,
      2,
      1
    ]);
  });

  it("repeated nonterminals and recursion", function() {
    let grammar = new Grammar([
      ["a1", "x"],
      ["a1", "a2", "x", "a2"],
      ["a2", "a3", "x", "a3"],
      ["a3", "a1", "x", "a1"]
    ]);

    expect(calculateSteps(grammar)).toEqual([
      1,
      15,
      7,
      3
    ]);
  });

  it("cycle", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    expect(calculateSteps(grammar)).toEqual(undefined);
  });

  it("unreachable", function() {
    let grammar = new Grammar([
      ["A", "x"],
      ["B", "y"]
    ]);

    expect(calculateSteps(grammar)).toEqual([
      1,
      1
    ]);
  });

  it("unrealizable", function() {
    let grammar = new Grammar([
      ["A", "A", "x"]
    ]);

    expect(calculateSteps(grammar)).toEqual(undefined);
  });
});
