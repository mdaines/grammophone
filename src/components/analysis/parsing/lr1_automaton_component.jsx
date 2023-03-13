import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lr1_automaton";
export const TITLE = "LR(1) Automaton";

export default function({ grammar }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRAutomatonComponent grammar={grammar} automaton={grammar.calculations.lr1Automaton} title={TITLE} />
    </section>
  );
}

