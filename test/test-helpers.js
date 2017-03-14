'use strict';

const assert = require('assert');
const Grammar = require('../src/grammar/index');
const Sets = require('../src/sets');
const Relations = require('../src/relations');

module.exports.assertSetEqual = function(expected, actual, message) {
  assert.ok(Sets.equal(expected, actual), message);
};

module.exports.assertRelationEqual = function(expected, actual, message) {
  assert.ok(Relations.equal(expected, actual), message);
};
