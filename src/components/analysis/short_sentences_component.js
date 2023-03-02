const SentencesComponent = require("./sentences_component.js");

module.exports = function({ getCalculation }) {
  return <SentencesComponent getCalculation={getCalculation} limit={10} />;
}
