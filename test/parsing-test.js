'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');

function assertParseProductions(expected, spec) {
  let parse = Grammar.parse(spec);
  if (parse.error) {
    throw parse.error;
  }
  let actual = parse.grammar.productions;
  
  assert.deepEqual(expected, actual);
}

function assertParseError(spec) {
  let parse = Grammar.parse(spec);
  assert.ok(parse.error, `Expected parse error for spec: ${spec}`);
}

describe('Parsing', function() {
  it('should parse basic grammars', function() {
    assertParseProductions([["A", "a"]], "A -> a .");
    assertParseProductions([["A", "a"], ["A", "b"]], "A -> a | b .");
    assertParseProductions([["A"]], "A -> .");
    assertParseProductions([["A", "a"], ["B", "b"], ["A", "c"]], "A -> a. B -> b. A -> c.");
  });

  it('should parse variations in spacing', function() {
    assertParseProductions([["A", "a"]], "A->a.");
    assertParseProductions([["A", "a"], ["A", "b"]], "A->a|b.");
    assertParseProductions([["A"]], "A->.");
  });

  it('should accept certain non-letter characters as symbols', function() {
    assertParseProductions([["A", "x", "-", ">", "y"]], "A -> x - > y.");
    assertParseProductions([["A'", "a"], ["A''", "a"]], "A' -> a. A'' -> a.");
    assertParseProductions([["A", "something-something"]], "A -> something-something.");
    assertParseProductions([["-", "-"]], "-->-.");
    assertParseProductions([["A", "1"], ["A", "2"], ["A", "3"]], "A -> 1 | 2 | 3.");
    assertParseProductions([["A", "\"", "'"]], "A -> \" \'.");
    assertParseProductions([["A", "\"a", "\""]], "A -> \"a \".");
  });

  it('should parse multiple lines', function() {
    assertParseProductions([["A", "a"], ["A", "b"]], "A -> a |\n  b\n  .");
  });

  it('should ignore comments', function() {
    assertParseProductions([["A", "b"]], "# A -> a .\nA -> b .");
    assertParseProductions([["A", "b"]], "# abc\n\nA -> b .");
    assertParseProductions([], "# 123\n\n");
  });

  it('should correctly emit parse errors', function() {
    assertParseError("A -> a. B");
    assertParseError("A B -> a.");
    assertParseError("A -> a. ->");
    assertParseError("-> X");
    assertParseError("A");
    assertParseError("A.y -> a.");
    assertParseError("A -> x.y .");
  });
});
