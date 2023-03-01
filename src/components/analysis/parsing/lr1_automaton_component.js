const AbstractLRAutomatonComponent = require("./abstract_lr_automaton_component.js");

module.exports = function({ getCalculation }) {
  return <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lr1_automaton" title="LR(1) Automaton" />;
}
