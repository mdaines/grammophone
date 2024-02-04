import AbstractLRTableComponent from "./abstract_lr_table_component.jsx";

export const ID = "lr1_table";
export const TITLE = "LR(1) Parsing Table";

export default function({ grammar }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRTableComponent
        grammar={grammar}
        table={grammar.calculations.lr1Table}
      />
    </section>
  );
}
