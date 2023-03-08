import AbstractLR1TableComponent from "./abstract_lr1_table_component.jsx";

export default function({ getCalculation }) {
  return <AbstractLR1TableComponent getCalculation={getCalculation} tableCalculation="parsing.lr.lr1_table" />;
}
