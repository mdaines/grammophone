'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');

const assertSetEqual = require('./test-helpers').assertSetEqual;

describe('Sanity', function() {
  it('testUnreachable', function() {
    assertSetEqual({ "C": true, "D": true }, new Grammar([["A", "B"], ["B"], ["C", "D"], ["D"]]).calculate("grammar.unreachable"));
  });
  
  it('testUnrealizable', function() {
    assertSetEqual({ "A": true, "B": true }, new Grammar([["A", "B"], ["B", "y", "B"]]).calculate("grammar.unrealizable"));
  });
  
  it('testCycles', function() {
    assert.deepEqual(["A", "B", "C", "A"], new Grammar([["A", "B"], ["B", "C"], ["C", "A"]]).calculate("grammar.cycle"));
    assert.deepEqual(["A", "A"], new Grammar([["A", "A"]]).calculate("grammar.cycle"));
  });
  
  it('testNullAmbiguity', function() {
    assert.deepEqual([0, 1], new Grammar([["A", "B"], ["A"], ["B"]]).calculate("grammar.nullAmbiguity"));
  });
  
  it('testAmbiguity', function() {
    assert.deepEqual(["a"], new Grammar([["A", "a", "C"], ["A", "B", "a"], ["B", "a", "B"], ["B"], ["C", "a", "C"], ["C"]]).calculate("grammar.ambiguous"));
  });
});