import AbstractLR1TableComponent from "./abstract_lr1_table_component.jsx";

export const ID = "lr1_table";
export const TITLE = "LR(1) Parsing Table";

export default function({ getCalculation }) {
  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      <AbstractLR1TableComponent getCalculation={getCalculation} tableCalculation="parsing.lr.lr1_table" />
    </section>
  );
}
