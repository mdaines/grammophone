const grammar = require('./grammar');
const parsing = require('./parsing');
const transformations = require('./transformations');

module.exports = Object.assign({},
  grammar,
  parsing,
  transformations
);
