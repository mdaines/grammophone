import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lalr1_automaton";
export const TITLE = "parsing." + ID;

export default function LALR1AutomatonComponent({ grammar }) {
  const { t } = useTranslation();
  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>
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
