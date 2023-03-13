import AbstractLR1TableComponent from "./abstract_lr1_table_component.jsx";

export const ID = "lalr1_table";
export const TITLE = "LALR(1) Parsing Table";

export default function({ grammar }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
    <AbstractLR1TableComponent grammar={grammar} table={grammar.calculations.lalr1Table} />
    </section>
  );
}
