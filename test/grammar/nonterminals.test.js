const Grammar = require("../../src/grammar");

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
    expect(calculate(Fixtures.expressions, "grammar.first")).toEqual({
      "exp": { "(": true, "number": true },
      "term": { "(": true, "number": true },
      "factor": { "(": true, "number": true },
      "addop": { "+": true, "-": true },
      "mulop": { "*": true }
    });

    expect(calculate(Fixtures.ifelse, "grammar.first")).toEqual({
      "statement": { "if": true, "other": true },
      "if-stmt": { "if": true },
      "else-part": { "else": true },
      "exp": { "0": true, "1": true }
    });

    expect(calculate(Fixtures.statements, "grammar.first")).toEqual({
      "stmt-sequence": { "s": true },
      "stmt-seq'": { ";": true },
      "stmt": { "s": true }
    });
  });

  it("testFollow", function() {
    expect(calculate(Fixtures.expressions, "grammar.follow")).toEqual({
      "exp": { "Grammar.END": true, "+": true, "-": true, ")": true },
      "term": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "factor": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "addop": { "(": true, "number": true },
      "mulop": { "(": true, "number": true }
    });

    expect(calculate(Fixtures.ifelse, "grammar.follow")).toEqual({
      "statement": { "Grammar.END": true, "else": true },
      "if-stmt": { "Grammar.END": true, "else": true },
      "else-part": { "Grammar.END": true, "else": true },
      "exp": { ")": true }
    });

    expect(calculate(Fixtures.statements, "grammar.follow")).toEqual({
      "stmt-sequence": { "Grammar.END": true },
      "stmt-seq'": { "Grammar.END": true },
      "stmt": { ";": true, "Grammar.END": true }
    });
  });

  it("testNullable", function() {
    expect(calculate(Fixtures.expressions, "grammar.nullable")).toEqual(new Set());
    expect(calculate(Fixtures.ifelse, "grammar.nullable")).toEqual(new Set(["else-part"]));
    expect(calculate(Fixtures.statements, "grammar.nullable")).toEqual(new Set(["stmt-seq'"]));
  });
});
