import Grammar from "../../src/grammar/index.js";
import Relation from "../../src/relation.js";
import { END } from "../../src/grammar/symbols.js";
import assert from "node:assert/strict";

function calculate(productions, calculation) {
  return new Grammar(productions).calculate(calculation);
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
    assert.deepStrictEqual(calculate(Fixtures.expressions, "grammar.first"), new Relation([
      ["addop", "+"],
      ["addop", "-"],
      ["mulop", "*"],
      ["factor", "("],
      ["factor", "number"],
      ["exp", "("],
      ["exp", "number"],
      ["term", "("],
      ["term", "number"]
    ]));

    assert.deepStrictEqual(calculate(Fixtures.ifelse, "grammar.first"), new Relation([
      ["statement", "other"],
      ["statement", "if"],
      ["if-stmt", "if"],
      ["else-part", "else"],
      ["exp", "0"],
      ["exp", "1"]
    ]));

    assert.deepStrictEqual(calculate(Fixtures.statements, "grammar.first"), new Relation([
      ["stmt-seq'", ";"],
      ["stmt", "s"],
      ["stmt-sequence", "s"]
    ]));
  });

  it("testFollow", function() {
    assert.deepStrictEqual(calculate(Fixtures.expressions, "grammar.follow"), new Relation([
      ["exp", END],
      ["exp", "+"],
      ["exp", "-"],
      ["exp", ")"],
      ["addop", "("],
      ["addop", "number"],
      ["term", "*"],
      ["term", END],
      ["term", "+"],
      ["term", "-"],
      ["term", ")"],
      ["mulop", "("],
      ["mulop", "number"],
      ["factor", "*"],
      ["factor", END],
      ["factor", "+"],
      ["factor", "-"],
      ["factor", ")"]
    ]));

    assert.deepStrictEqual(calculate(Fixtures.ifelse, "grammar.follow"), new Relation([
      ["statement", END],
      ["statement", "else"],
      ["exp", ")"],
      ["if-stmt", END],
      ["if-stmt", "else"],
      ["else-part", END],
      ["else-part", "else"]
    ]));

    assert.deepStrictEqual(calculate(Fixtures.statements, "grammar.follow"), new Relation([
      ["stmt-sequence", END],
      ["stmt", ";"],
      ["stmt", END],
      ["stmt-seq'", END]
    ]));
  });

  it("testNullable", function() {
    assert.deepStrictEqual(calculate(Fixtures.expressions, "grammar.nullable"), new Set());
    assert.deepStrictEqual(calculate(Fixtures.ifelse, "grammar.nullable"), new Set(["else-part"]));
    assert.deepStrictEqual(calculate(Fixtures.statements, "grammar.nullable"), new Set(["stmt-seq'"]));
  });
});
