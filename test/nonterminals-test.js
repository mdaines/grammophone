'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');
const assertRelationEqual = require('./test-helpers').assertRelationEqual;
const assertSetEqual = require('./test-helpers').assertSetEqual;

function parse(spec) {
  return Grammar.parse(spec).grammar;
}

const Fixtures = {
  // Louden, p.170
  expressions: `exp -> exp addop term | term.
addop -> + | -.
term -> term mulop factor | factor.
mulop -> *.
factor -> ( exp ) | number.`,
  
  // Louden, p.171
  ifelse: `statement -> if-stmt | other.
if-stmt -> if ( exp ) statement else-part.
else-part -> else statement | .
exp -> 0 | 1.`,

  // Louden, p.173
  statements: `stmt-sequence -> stmt stmt-seq' .
stmt-seq' -> ; stmt-sequence | .
stmt -> s.`
};

describe("Nonterminals", function() {
  it('should calculate first sets', function() {
    assertRelationEqual({
      "exp": { "(": true, "number": true },
      "term": { "(": true, "number": true },
      "factor": { "(": true, "number": true },
      "addop": { "+": true, "-": true },
      "mulop": { "*": true }
    }, parse(Fixtures.expressions).calculate("grammar.first"));
    
    assertRelationEqual({
      "statement": { "if": true, "other": true },
      "if-stmt": { "if": true },
      "else-part": { "else": true },
      "exp": { "0": true, "1": true }
    }, parse(Fixtures.ifelse).calculate("grammar.first"));
    
    assertRelationEqual({
      "stmt-sequence": { "s": true },
      "stmt-seq'": { ";": true },
      "stmt": { "s": true }
    }, parse(Fixtures.statements).calculate("grammar.first"));
  });
  
  it('should calculate follow sets', function() {
    assertRelationEqual({
      "exp": { "Grammar.END": true, "+": true, "-": true },
      "term": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "factor": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "addop": { "(": true, "number": true },
      "mulop": { "(": true, "number": true }
    }, parse(Fixtures.expressions).calculate("grammar.follow"));
    
    assertRelationEqual({
      "statement": { "Grammar.END": true, "else": true },
      "if-stmt": { "Grammar.END": true, "else": true },
      "else-part": { "Grammar.END": true, "else": true },
      "exp": { ")": true }
    }, parse(Fixtures.ifelse).calculate("grammar.follow"));
    
    assertRelationEqual({
      "stmt-sequence": { "Grammar.END": true },
      "stmt-seq'": { "Grammar.END": true },
      "stmt": { ";": true, "Grammar.END": true }
    }, parse(Fixtures.statements).calculate("grammar.follow"));
  });
  
  it('should calculate nullable nonterminals', function() {
    assertSetEqual({ }, parse(Fixtures.expressions).calculate("grammar.nullable"));
    assertSetEqual({ "else-part": true }, parse(Fixtures.ifelse).calculate("grammar.nullable"));
    assertSetEqual({ "stmt-seq'": true }, parse(Fixtures.statements).calculate("grammar.nullable"));
  });
});
