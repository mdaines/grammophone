const { formatSentence } = require("../helpers.js");

module.exports = function({ getCalculation, limit = 30 }) {
  const sentences = getCalculation("grammar.sentences");
  const info = getCalculation("grammar.symbolInfo");

  const examples = sentences.slice(0, limit).map(function(sentence) {
    return <li>{formatSentence(sentence, info)}</li>;
  });

  return (
    <>
      <h1>Example Sentences</h1>
      {sentences.length > 0 ? <ul class="symbols">{examples}</ul> : <p>{"No example sentences could be generated."}</p>}
      {sentences.length > limit ? <p><a href="#/sentences">{"More example sentences"}</a></p> : null}
    </>
  );
}
