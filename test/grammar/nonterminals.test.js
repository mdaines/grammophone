const Grammar = require("../../src/grammar");
const Relation = require("../../src/relation");
const END = require("../../src/grammar/symbols").END;

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
    expect(calculate(Fixtures.expressions, "grammar.first")).toEqual(new Relation([
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

    expect(calculate(Fixtures.ifelse, "grammar.first")).toEqual(new Relation([
      ["statement", "other"],
      ["statement", "if"],
      ["if-stmt", "if"],
      ["else-part", "else"],
      ["exp", "0"],
      ["exp", "1"]
    ]));

    expect(calculate(Fixtures.statements, "grammar.first")).toEqual(new Relation([
      ["stmt-seq'", ";"],
      ["stmt", "s"],
      ["stmt-sequence", "s"]
    ]));
  });

  it("testFollow", function() {
    expect(calculate(Fixtures.expressions, "grammar.follow")).toEqual(new Relation([
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

    expect(calculate(Fixtures.ifelse, "grammar.follow")).toEqual(new Relation([
      ["statement", END],
      ["statement", "else"],
      ["exp", ")"],
      ["if-stmt", END],
      ["if-stmt", "else"],
      ["else-part", END],
      ["else-part", "else"]
    ]));

    expect(calculate(Fixtures.statements, "grammar.follow")).toEqual(new Relation([
      ["stmt-sequence", END],
      ["stmt", ";"],
      ["stmt", END],
      ["stmt-seq'", END]
    ]));
  });

  it("testNullable", function() {
    expect(calculate(Fixtures.expressions, "grammar.nullable")).toEqual(new Set());
    expect(calculate(Fixtures.ifelse, "grammar.nullable")).toEqual(new Set(["else-part"]));
    expect(calculate(Fixtures.statements, "grammar.nullable")).toEqual(new Set(["stmt-seq'"]));
  });
});
