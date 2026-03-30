import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import AbstractLRTableComponent from "./abstract_lr_table_component.jsx";

export const ID = "lr0_table";
export const TITLE = "parsing." + ID;

export default function LR0TableComponent({ grammar }) {
  const { t } = useTranslation();
  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>
      <AbstractLRTableComponent
        grammar={grammar}
        table={grammar.calculations.lr0Table}
      />
    </section>
  );
}

LR0TableComponent.propTypes = {
  grammar: PropTypes.object.isRequired
};
