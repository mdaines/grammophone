import Grammar from "../../src/grammar/index.js";
import assert from "node:assert/strict";

function calculate(productions, calculation) {
  return new Grammar(productions).calculate(calculation);
}

describe("GrammarSanityChecksTest", function() {
  it("testUnreachable", function() {
    assert.deepStrictEqual(calculate([["A", "B"], ["B"], ["C", "D"], ["D"]], "grammar.unreachable"), new Set(["C", "D"]));
  });

  it("testUnrealizable", function() {
    assert.deepStrictEqual(calculate([["A", "B"], ["B", "y", "B"]], "grammar.unrealizable"), new Set(["A", "B"]));
  });

  it("testCycles", function() {
    assert.deepStrictEqual(calculate([["A", "B"], ["B", "C"], ["C", "A"]], "grammar.cycle"), ["A", "B", "C", "A"]);
    assert.deepStrictEqual(calculate([["A", "A"]], "grammar.cycle"), ["A", "A"]);
  });

  it("testNullAmbiguity", function() {
    assert.deepStrictEqual(calculate([["A", "B"], ["A"], ["B"]], "grammar.nullAmbiguity"), [0, 1]);
  });

  it("testAmbiguity", function() {
    assert.deepStrictEqual(calculate([["A", "a", "C"], ["A", "B", "a"], ["B", "a", "B"], ["B"], ["C", "a", "C"], ["C"]], "grammar.ambiguous"), ["a"]);
  });
});
