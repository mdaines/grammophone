import { formatSentence } from "../helpers.js";
import { makeSentencesIterator, takeFromIterator } from "../../grammar/sentences_iterator.js";

export default function({ grammar }) {
  const symbolInfo = grammar.calculate("grammar.symbolInfo");
  const iterator = makeSentencesIterator(grammar);
  const { values, done } = takeFromIterator(iterator, 10, 1000);

  let examples, link;

  if (values.length == 0 && done) {
    examples = <p>{"No example sentences could be generated."}</p>;
  } else {
    examples = (
      <ul className="symbols">
        {
          values.map(function(sentence, index) {
            return <li key={index}>{formatSentence(sentence, symbolInfo)}</li>;
          })
        }
      </ul>
    );
  }

  if (!done) {
    link = <p><a href="#/sentences">{"More example sentences"}</a></p>;
  }

  return (
    <>
      <h1>Example Sentences</h1>
      {examples}
      {link}
    </>
  );
}
