const Grammar = require("../../src/grammar");

function calculate(productions, calculation) {
  return new Grammar(productions).calculate(calculation);
}

describe("GrammarSanityChecksTest", function() {
  it("testUnreachable", function() {
    expect(calculate([["A", "B"], ["B"], ["C", "D"], ["D"]], "grammar.unreachable")).toEqual(new Set(["C", "D"]));
  });

  it("testUnrealizable", function() {
    expect(calculate([["A", "B"], ["B", "y", "B"]], "grammar.unrealizable")).toEqual(new Set(["A", "B"]));
  });

  it("testCycles", function() {
    expect(calculate([["A", "B"], ["B", "C"], ["C", "A"]], "grammar.cycle")).toEqual(["A", "B", "C", "A"]);
    expect(calculate([["A", "A"]], "grammar.cycle")).toEqual(["A", "A"]);
  });

  it("testNullAmbiguity", function() {
    expect(calculate([["A", "B"], ["A"], ["B"]], "grammar.nullAmbiguity")).toEqual([0, 1]);
  });

  it("testAmbiguity", function() {
    expect(calculate([["A", "a", "C"], ["A", "B", "a"], ["B", "a", "B"], ["B"], ["C", "a", "C"], ["C"]], "grammar.ambiguous")).toEqual(["a"]);
  });
});
