import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lr0_automaton";
export const TITLE = "LR(0) Automaton";

export default function({ grammar }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRAutomatonComponent grammar={grammar} automaton={grammar.calculations.lr0Automaton} />
    </section>
  );
}
