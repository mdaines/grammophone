import SentencesComponent from "./sentences_component.js";

export default function({ getCalculation }) {
  return <SentencesComponent getCalculation={getCalculation} limit={10} />;
}
