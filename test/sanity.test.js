const Grammar = require("../src/grammar");
const Sets = require("../src/sets");

function calculate(productions, calculation) {

  return new Grammar(productions).calculate(calculation);

}

function isSetEqual(a, b) {

  return Sets.count(Sets.intersection(a, b)) === Sets.count(a);

}

function assertSetEqual(expected, actual, message) {

  expect(
    isSetEqual(expected, actual)
  ).toBe(true);

}

function assertArrayEqual(expected, actual, message) {

  var passed, i;

  if (expected.length !== actual.length) {
    passed = false;
  } else {
    for (i = 0, passed = true; i < expected.length && passed; i++)
      passed = expected[i] === actual[i];
  }

  expect(
    passed
  ).toBe(true);

}

describe("GrammarSanityChecksTest", function() {

  it("testUnreachable", function() {

    assertSetEqual({ "C": true, "D": true }, calculate([["A", "B"], ["B"], ["C", "D"], ["D"]], "grammar.unreachable"));

  });

  it("testUnrealizable", function() {

    assertSetEqual({ "A": true, "B": true }, calculate([["A", "B"], ["B", "y", "B"]], "grammar.unrealizable"));

  });

  it("testCycles", function() {

    assertArrayEqual(["A", "B", "C", "A"], calculate([["A", "B"], ["B", "C"], ["C", "A"]], "grammar.cycle"));
    assertArrayEqual(["A", "A"], calculate([["A", "A"]], "grammar.cycle"));

  });

  it("testNullAmbiguity", function() {

    assertArrayEqual([0, 1], calculate([["A", "B"], ["A"], ["B"]], "grammar.nullAmbiguity"));

  });

  it("testAmbiguity", function() {

    assertArrayEqual(["a"], calculate([["A", "a", "C"], ["A", "B", "a"], ["B", "a", "B"], ["B"], ["C", "a", "C"], ["C"]], "grammar.ambiguous"));

  });

});
