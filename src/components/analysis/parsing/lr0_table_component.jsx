import AbstractLRTableComponent from "./abstract_lr_table_component.jsx";

export const ID = "lr0_table";
export const TITLE = "LR(0) Parsing Table";

export default function({ grammar }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLRTableComponent
        grammar={grammar}
        table={grammar.calculations.lr0Table}
        includeEnd={true}
      />
    </section>
  );
}
