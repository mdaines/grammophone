const grammarCalculations = require('./grammar');
const llCalculations = require('./ll');
const lrCalculations = require('./lr');
const transformationsCalculations = require('./transformations');

module.exports = Object.assign({},
  grammarCalculations,
  llCalculations,
  lrCalculations,
  transformationsCalculations
);
