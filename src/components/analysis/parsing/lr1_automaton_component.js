import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.js";

export default function({ getCalculation }) {
  return <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lr1_automaton" title="LR(1) Automaton" />;
}
