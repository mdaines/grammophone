'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');

describe('Transformations', function() {
  it('should expand nonterminals', function() {
    let transformations = new Grammar([["S", "a", "S", "b"], ["S"]]).calculate("transformations.expand");
    
    assert.deepEqual([
      {
        name: "expand",
        production: 0,
        symbol: 2,
        changes: [
          { operation: "delete", index: 0 },
          { operation: "insert", index: 0, production: ["S", "a", "a", "S", "b", "b"] },
          { operation: "insert", index: 1, production: ["S", "a", "b"] }
        ]
      }
    ], transformations);
  });
});
