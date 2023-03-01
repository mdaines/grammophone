const LR1TableComponent = require("./lr1_table_component.js");

module.exports = function({ getCalculation }) {
  return <LR1TableComponent getCalculation={getCalculation} tableCalculation="parsing.lr.slr1_table" />;
}
