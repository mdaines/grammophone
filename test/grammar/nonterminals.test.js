const Grammar = require("../../src/grammar");
const Sets = require("../../src/sets");

function calculate(grammar, calculation) {

  return grammar.calculate(calculation);

}

function isSetEqual(a, b) {

  return Sets.count(Sets.intersection(a, b)) === Sets.count(a);

}

function isRelationEqual(a, b) {

  var k;

  if (Sets.count(a) !== Sets.count(b)) {
    return false;
  }

  for (k in a) {
    if (!isSetEqual(a[k], b[k])) {
      return false;
    }
  }

  return true;

}

function assertRelationEqual(expected, actual, message) {

  expect(
    isRelationEqual(expected, actual)
  ).toBe(true);

}

function assertSetEqual(expected, actual, message) {

  expect(
    isSetEqual(expected, actual)
  ).toBe(true);

}

var Fixtures = {
  // Louden, p.170
  expressions: [
    [ 'exp', 'exp', 'addop', 'term' ],
    [ 'exp', 'term' ],
    [ 'addop', '+' ],
    [ 'addop', '-' ],
    [ 'term', 'term', 'mulop', 'factor' ],
    [ 'term', 'factor' ],
    [ 'mulop', '*' ],
    [ 'factor', '(', 'exp', ')' ],
    [ 'factor', 'number' ]
  ],

  // Louden, p.171
  ifelse: [
    [ 'statement', 'if-stmt' ],
    [ 'statement', 'other' ],
    [ 'if-stmt', 'if', '(', 'exp', ')', 'statement', 'else-part' ],
    [ 'else-part', 'else', 'statement' ],
    [ 'else-part' ],
    [ 'exp', '0' ],
    [ 'exp', '1' ]
  ],

  // Louden, p.173
  statements: [
    [ 'stmt-sequence', 'stmt', "stmt-seq'" ],
    [ "stmt-seq'", ';', 'stmt-sequence' ],
    [ "stmt-seq'" ],
    [ 'stmt', 's' ]
  ]
};

describe("GrammarNonterminalsTest", function() {

  it("testFirst", function() {

    assertRelationEqual({
      "exp": { "(": true, "number": true },
      "term": { "(": true, "number": true },
      "factor": { "(": true, "number": true },
      "addop": { "+": true, "-": true },
      "mulop": { "*": true }
    }, calculate(new Grammar(Fixtures.expressions), "grammar.first"));

    assertRelationEqual({
      "statement": { "if": true, "other": true },
      "if-stmt": { "if": true },
      "else-part": { "else": true },
      "exp": { "0": true, "1": true }
    }, calculate(new Grammar(Fixtures.ifelse), "grammar.first"));

    assertRelationEqual({
      "stmt-sequence": { "s": true },
      "stmt-seq'": { ";": true },
      "stmt": { "s": true }
    }, calculate(new Grammar(Fixtures.statements), "grammar.first"));

  });

  it("testFollow", function() {

    assertRelationEqual({
      "exp": { "Grammar.END": true, "+": true, "-": true },
      "term": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "factor": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "addop": { "(": true, "number": true },
      "mulop": { "(": true, "number": true }
    }, calculate(new Grammar(Fixtures.expressions), "grammar.follow"));

    assertRelationEqual({
      "statement": { "Grammar.END": true, "else": true },
      "if-stmt": { "Grammar.END": true, "else": true },
      "else-part": { "Grammar.END": true, "else": true },
      "exp": { ")": true }
    }, calculate(new Grammar(Fixtures.ifelse), "grammar.follow"));

    assertRelationEqual({
      "stmt-sequence": { "Grammar.END": true },
      "stmt-seq'": { "Grammar.END": true },
      "stmt": { ";": true, "Grammar.END": true }
    }, calculate(new Grammar(Fixtures.statements), "grammar.follow"));

  });

  it("testNullable", function() {

    assertSetEqual({ }, calculate(new Grammar(Fixtures.expressions), "grammar.nullable"));
    assertSetEqual({ "else-part": true }, calculate(new Grammar(Fixtures.ifelse), "grammar.nullable"));
    assertSetEqual({ "stmt-seq'": true }, calculate(new Grammar(Fixtures.statements), "grammar.nullable"));

  });

});
