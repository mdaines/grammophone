var grammar = require('./grammar');
var parsing = require('./parsing');
var transformations = require('./transformations');

module.exports = Object.assign({},
  grammar,
  parsing,
  transformations
);
