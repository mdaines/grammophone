import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lr1_automaton";
export const TITLE = "LR(1) Automaton";

export default function({ getCalculation }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lr1_automaton" title={TITLE} />
    </section>
  );
}

