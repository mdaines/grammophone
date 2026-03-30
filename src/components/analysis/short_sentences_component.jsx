import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { formatSentence } from "../helpers.js";
import { takeFromIterator } from "../../grammar/sentences.js";

export const ID = "short_sentences";
export const TITLE = "analysis." + ID;

export default function ShortSentencesComponent({ grammar }) {
  const { t } = useTranslation();
  const { symbolInfo } = grammar.calculations;
  const iterator = grammar.exampleSentences();
  const { values, done } = takeFromIterator(iterator, 10, 1000);

  let examples, link;

  if (values.length == 0 && done) {
    examples = <p>{t("analysis.noExampleSentences")}</p>;
  } else {
    examples = (
      <ul className="symbols">
        {values.map(function (sentence, index) {
          return <li key={index}>{formatSentence(sentence, symbolInfo)}</li>;
        })}
      </ul>
    );
  }

  if (!done) {
    link = (
      <p>
        <a href="#/sentences">{t("analysis.moreExampleSentences")}</a>
      </p>
    );
  }

  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>
      {examples}
      {link}
    </section>
  );
}

ShortSentencesComponent.propTypes = {
  grammar: PropTypes.shape({
    calculations: PropTypes.shape({
      symbolInfo: PropTypes.object.isRequired
    }).isRequired,
    exampleSentences: PropTypes.func.isRequired
  }).isRequired
};
