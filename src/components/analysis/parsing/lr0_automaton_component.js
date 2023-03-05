import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.js";

export default function({ getCalculation }) {
  return <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lr0_automaton" title="LR(0) Automaton" />;
}
