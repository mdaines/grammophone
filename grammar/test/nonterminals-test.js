'use strict';

const assert = require('assert');
const Grammar = require('../index');
const Sets = require('../sets');

function calculate(grammar, calculation) {
  return grammar.calculate(calculation);
}

function parse(spec) {
  return Grammar.parse(spec).grammar;
}

function isSetEqual(a, b) {
  return Sets.count(Sets.intersection(a, b)) === Sets.count(a);
}

function isRelationEqual(a, b) {
  if (Sets.count(a) !== Sets.count(b)) {
    return false;
  }
  
  for (let k in a) {
    if (a.hasOwnProperty(k) && !isSetEqual(a[k], b[k])) {
      return false;
    }
  }
  
  return true;
}

function assertRelationEqual(expected, actual, message) {
  assert.ok(isRelationEqual(expected, actual), message);
}

function assertSetEqual(expected, actual, message) {
  assert.ok(isSetEqual(expected, actual), message);
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
  it('testFirst', function() {
    assertRelationEqual({
      "exp": { "(": true, "number": true },
      "term": { "(": true, "number": true },
      "factor": { "(": true, "number": true },
      "addop": { "+": true, "-": true },
      "mulop": { "*": true }
    }, calculate(parse(Fixtures.expressions), "grammar.first"));
    
    assertRelationEqual({
      "statement": { "if": true, "other": true },
      "if-stmt": { "if": true },
      "else-part": { "else": true },
      "exp": { "0": true, "1": true }
    }, calculate(parse(Fixtures.ifelse), "grammar.first"));
    
    assertRelationEqual({
      "stmt-sequence": { "s": true },
      "stmt-seq'": { ";": true },
      "stmt": { "s": true }
    }, calculate(parse(Fixtures.statements), "grammar.first"));
  });
  
  it('testFollow', function() {
    assertRelationEqual({
      "exp": { "Grammar.END": true, "+": true, "-": true },
      "term": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "factor": { "Grammar.END": true, "+": true, "-": true, "*": true, ")": true },
      "addop": { "(": true, "number": true },
      "mulop": { "(": true, "number": true }
    }, calculate(parse(Fixtures.expressions), "grammar.follow"));
    
    assertRelationEqual({
      "statement": { "Grammar.END": true, "else": true },
      "if-stmt": { "Grammar.END": true, "else": true },
      "else-part": { "Grammar.END": true, "else": true },
      "exp": { ")": true }
    }, calculate(parse(Fixtures.ifelse), "grammar.follow"));
    
    assertRelationEqual({
      "stmt-sequence": { "Grammar.END": true },
      "stmt-seq'": { "Grammar.END": true },
      "stmt": { ";": true, "Grammar.END": true }
    }, calculate(parse(Fixtures.statements), "grammar.follow"));
  });
  
  it('testNullable', function() {
    assertSetEqual({ }, calculate(parse(Fixtures.expressions), "grammar.nullable"));
    assertSetEqual({ "else-part": true }, calculate(parse(Fixtures.ifelse), "grammar.nullable"));
    assertSetEqual({ "stmt-seq'": true }, calculate(parse(Fixtures.statements), "grammar.nullable"));
  });
});
