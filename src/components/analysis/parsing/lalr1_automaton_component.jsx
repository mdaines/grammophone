import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lalr1_automaton";
export const TITLE = "LALR(1) Automaton";

export default function({ grammar }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRAutomatonComponent
        grammar={grammar}
        automaton={grammar.calculations.lalr1Automaton}
        table={grammar.calculations.lalr1Table}
      />
    </section>
  );
}
