const Grammar = require("../../src/grammar");

describe("steps", function() {
  it("simple grammar", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["S", 1]
      ]),
      productions: new Map([
        [0, 2],
        [1, 1]
      ])
    });
  });

  it("recursion", function() {
    let grammar = new Grammar([
      ["B", "z", "B"],
      ["B", "u"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["B", 1]
      ]),
      productions: new Map([
        [0, 2],
        [1, 1]
      ])
    });
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

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", 1],
        ["B", 1],
        ["C", 1]
      ]),
      productions: new Map([
        [0, 2],
        [1, 1],
        [2, 3],
        [3, 2],
        [4, 1],
        [5, 1]
      ])
    });
  });

  it("multiple steps", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "x"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", 3],
        ["B", 2],
        ["C", 1]
      ]),
      productions: new Map([
        [0, 3],
        [1, 2],
        [2, 1]
      ])
    });
  });

  it("repeated nonterminals and recursion", function() {
    let grammar = new Grammar([
      ["a1", "x"],
      ["a1", "a2", "x", "a2"],
      ["a2", "a3", "x", "a3"],
      ["a3", "a1", "x", "a1"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["a1", 1],
        ["a2", 7],
        ["a3", 3]
      ]),
      productions: new Map([
        [0, 1],
        [1, 15],
        [2, 7],
        [3, 3]
      ])
    });
  });

  it("cycle", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", undefined],
        ["B", undefined],
        ["C", undefined]
      ]),
      productions: new Map([
        [0, undefined],
        [1, undefined],
        [2, undefined]
      ])
    });
  });

  it("optional cycle", function() {
    let grammar = new Grammar([
      ["A", "x"],
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", 1],
        ["B", 3],
        ["C", 2]
      ]),
      productions: new Map([
        [0, 1],
        [1, 4],
        [2, 3],
        [3, 2]
      ])
    });
  });

  it("unreachable", function() {
    let grammar = new Grammar([
      ["A", "x"],
      ["B", "y"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", 1],
        ["B", 1]
      ]),
      productions: new Map([
        [0, 1],
        [1, 1]
      ])
    });
  });

  it("unrealizable", function() {
    let grammar = new Grammar([
      ["A", "A", "x"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", undefined]
      ]),
      productions: new Map([
        [0, undefined]
      ])
    });
  });

  it("partially unrealizable", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["A", "x", "C"],
      ["A", "y", "A"],
      ["B", "C", "B"],
      ["C", "r"]
    ]);

    expect(grammar.calculate("grammar.steps")).toEqual({
      symbols: new Map([
        ["A", 2],
        ["B", undefined],
        ["C", 1]
      ]),
      productions: new Map([
        [0, undefined],
        [1, 2],
        [2, 3],
        [3, undefined],
        [4, 1]
      ])
    });
  });
});
