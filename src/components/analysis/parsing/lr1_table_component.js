const AbstractLR1TableComponent = require("./abstract_lr1_table_component.js");

module.exports = function({ getCalculation }) {
  return <AbstractLR1TableComponent getCalculation={getCalculation} tableCalculation="parsing.lr.lr1_table" />;
}
