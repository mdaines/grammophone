'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');
const Sets = require('../src/grammar/sets');

function calculate(productions, calculation) {
  return new Grammar(productions).calculate(calculation);
}

function isSetEqual(a, b) {
  return Sets.count(Sets.intersection(a, b)) === Sets.count(a);
}

function assertSetEqual(expected, actual) {
  assert.ok(isSetEqual(expected, actual));
}

describe('Sanity', function() {
  it('testUnreachable', function() {
    assertSetEqual({ "C": true, "D": true }, calculate([["A", "B"], ["B"], ["C", "D"], ["D"]], "grammar.unreachable"));
  });
  
  it('testUnrealizable', function() {
    assertSetEqual({ "A": true, "B": true }, calculate([["A", "B"], ["B", "y", "B"]], "grammar.unrealizable"));
  });
  
  it('testCycles', function() {
    assert.deepEqual(["A", "B", "C", "A"], calculate([["A", "B"], ["B", "C"], ["C", "A"]], "grammar.cycle"));
    assert.deepEqual(["A", "A"], calculate([["A", "A"]], "grammar.cycle"));
  });
  
  it('testNullAmbiguity', function() {
    assert.deepEqual([0, 1], calculate([["A", "B"], ["A"], ["B"]], "grammar.nullAmbiguity"));
  });
  
  it('testAmbiguity', function() {
    assert.deepEqual(["a"], calculate([["A", "a", "C"], ["A", "B", "a"], ["B", "a", "B"], ["B"], ["C", "a", "C"], ["C"]], "grammar.ambiguous"));
  });
});