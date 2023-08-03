import { formatSentence } from "../helpers.js";
import { takeFromIterator } from "../../grammar/sentences.js";

import { Link } from "react-router-dom";

export const ID = "short_sentences";
export const TITLE = "Example Sentences";

export default function({ grammar }) {
  const { symbolInfo } = grammar.calculations;
  const iterator = grammar.exampleSentences();
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
    link = <p><Link to="sentences">{"More example sentences"}</Link></p>;
  }

  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>
      {examples}
      {link}
    </section>
  );
}
