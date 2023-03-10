import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lr0_automaton";
export const TITLE = "LR(0) Automaton";

export default function({ getCalculation }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRAutomatonComponent getCalculation={getCalculation} automatonCalculation="parsing.lr.lr0_automaton" title={TITLE} />
    </section>
  );
}
