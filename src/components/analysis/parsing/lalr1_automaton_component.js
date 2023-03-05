import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.js";

export default function({ getCalculation }) {
  return <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lalr1_automaton" title="LALR(1) Automaton" />;
}
