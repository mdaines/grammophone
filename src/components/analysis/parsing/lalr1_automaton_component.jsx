import PropTypes from "prop-types";
import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lalr1_automaton";
export const TITLE = "LALR(1) Automaton";

export default function LALR1AutomatonComponent({ grammar }) {
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

LALR1AutomatonComponent.propTypes = {
  grammar: PropTypes.object.isRequired
};
