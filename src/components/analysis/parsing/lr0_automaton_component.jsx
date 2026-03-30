import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import AbstractLRAutomatonComponent from "./abstract_lr_automaton_component.jsx";

export const ID = "lr0_automaton";
export const TITLE = "parsing." + ID;

export default function LR0AutomatonComponent({ grammar }) {
  const { t } = useTranslation();
  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>
      <AbstractLRAutomatonComponent
        grammar={grammar}
        automaton={grammar.calculations.lr0Automaton}
        table={grammar.calculations.lr0Table}
      />
    </section>
  );
}

LR0AutomatonComponent.propTypes = {
  grammar: PropTypes.object.isRequired
};
