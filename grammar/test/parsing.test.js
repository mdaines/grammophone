const Grammar = require("../src/index");

function productionsEqual(a, b) {

  var i, j;

  if (a.length !== b.length)
    return false;

  for (i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length)
      return false;

    for (j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j])
        return false;
    }
  }

  return true;

}

function assertParseProductions(expected, spec, message) {

  var parse = Grammar.parse(spec);

  if (parse.error)
    throw parse.error;

  var actual = parse.grammar.productions;

  expect(
    productionsEqual(expected, actual)
  ).toBe(true);

}

function assertParseError(spec, message) {

  var parse = Grammar.parse(spec);

  expect(
    typeof parse.error !== "undefined"
  ).toBe(true);

}

describe("GrammarParsingTest", function() {

  it("testBasics", function() {

    assertParseProductions([["A", "a"]], "A -> a .");
    assertParseProductions([["A", "a"], ["A", "b"]], "A -> a | b .");
    assertParseProductions([["A"]], "A -> .");
    assertParseProductions([["A", "a"], ["B", "b"], ["A", "c"]], "A -> a. B -> b. A -> c.");

  });

  it("testSpacing", function() {

    assertParseProductions([["A", "a"]], "A->a.");
    assertParseProductions([["A", "a"], ["A", "b"]], "A->a|b.");
    assertParseProductions([["A"]], "A->.");

  });

  it("testOtherChars", function() {

    assertParseProductions([["A", "x", "-", ">", "y"]], "A -> x - > y.");
    assertParseProductions([["A'", "a"], ["A''", "a"]], "A' -> a. A'' -> a.");
    assertParseProductions([["A", "something-something"]], "A -> something-something.");
    assertParseProductions([["-", "-"]], "-->-.");
    assertParseProductions([["A", "1"], ["A", "2"], ["A", "3"]], "A -> 1 | 2 | 3.");
    assertParseProductions([["A", "\"", "'"]], "A -> \" \'.");
    assertParseProductions([["A", "\"a", "\""]], "A -> \"a \".");

  });

  it("testMultipleLines", function() {

    assertParseProductions([["A", "a"], ["A", "b"]], "A -> a |\n  b\n  .");

  });

  it("testComments", function() {

    assertParseProductions([["A", "b"]], "# A -> a .\nA -> b .");

    assertParseProductions([["A", "b"]], "# abc\n\nA -> b .");
    assertParseProductions([], "# 123\n\n");

  });

  it("testParseErrors", function() {

    assertParseError("A -> a. B");
    assertParseError("A B -> a.");
    assertParseError("A -> a. ->");
    assertParseError("-> X");
    assertParseError("A");
    assertParseError("A.y -> a.");
    assertParseError("A -> x.y .");

  });

});
