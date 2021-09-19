const Grammar = require("../../src/grammar");

describe("steps", function() {
  it("simple grammar", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);

    // expect(grammar.calculate("grammar.steps")).toEqual([
    //   2,
    //   1
    // ]);

    expect(grammar.calculate("grammar.steps")).toEqual(new Map([
      ["S", 1]
    ]));
  });

  it("recursion", function() {
    let grammar = new Grammar([
      ["B", "z", "B"],
      ["B", "u"]
    ]);

    // expect(grammar.calculate("grammar.steps")).toEqual([
    //   2,
    //   1
    // ]);

    expect(grammar.calculate("grammar.steps")).toEqual(new Map([
      ["B", 1]
    ]));
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

    // expect(grammar.calculate("grammar.steps")).toEqual([
    //   2,
    //   1,
    //   3,
    //   2,
    //   1,
    //   1
    // ]);

    expect(grammar.calculate("grammar.steps")).toEqual(new Map([
      ["A", 1],
      ["B", 1],
      ["C", 1]
    ]));
  });

  it("multiple steps", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "x"]
    ]);

    // expect(grammar.calculate("grammar.steps")).toEqual([
    //   3,
    //   2,
    //   1
    // ]);

    expect(grammar.calculate("grammar.steps")).toEqual(new Map([
      ["A", 3],
      ["B", 2],
      ["C", 1]
    ]));
  });

  it("repeated nonterminals and recursion", function() {
    let grammar = new Grammar([
      ["a1", "x"],
      ["a1", "a2", "x", "a2"],
      ["a2", "a3", "x", "a3"],
      ["a3", "a1", "x", "a1"]
    ]);

    // expect(grammar.calculate("grammar.steps")).toEqual([
    //   1,
    //   15,
    //   7,
    //   3
    // ]);

    expect(grammar.calculate("grammar.steps")).toEqual(new Map([
      ["a1", 1],
      ["a2", 7],
      ["a3", 3]
    ]));
  });

  it("cycle", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual(undefined);
  });

  it("unreachable", function() {
    let grammar = new Grammar([
      ["A", "x"],
      ["B", "y"]
    ]);

    // expect(grammar.calculate("grammar.steps")).toEqual([
    //   1,
    //   1
    // ]);

    expect(grammar.calculate("grammar.steps")).toEqual(new Map([
      ["A", 1],
      ["B", 1]
    ]));
  });

  it("unrealizable", function() {
    let grammar = new Grammar([
      ["A", "A", "x"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual(undefined);
  });
});
