const AbstractLRAutomatonComponent = require("./abstract_lr_automaton_component.js");

module.exports = function({ getCalculation }) {
  return <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lalr1_automaton" title="LALR(1) Automaton" />;
}
