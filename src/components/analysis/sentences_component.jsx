import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { formatSentence } from "../helpers.js";
import { takeFromIterator } from "../../grammar/sentences.js";
import { useState } from "react";

function takePage(iterator) {
  return takeFromIterator(iterator, 20, 1000);
}

export const ID = "sentences";
export const TITLE = "analysis." + ID;

export default function SentencesInternalComponent({ grammar }) {
  const { t } = useTranslation();
  const { symbolInfo } = grammar.calculations;
  const [state, setState] = useState(() => {
    const iterator = grammar.exampleSentences();
    return { iterator, sentences: takePage(iterator) };
  });

  function more() {
    const { values, done } = takePage(state.iterator);
    const sentences = {
      values: state.sentences.values.concat(values),
      done
    };

    setState({ ...state, sentences });
  }

  let examples;

  if (state.sentences.values.length == 0 && state.sentences.done) {
    examples = <p>{t("analysis.noExampleSentences")}</p>;
  } else {
    examples = (
      <ul className="symbols">
        {state.sentences.values.map((sentence, index) => {
          return <li key={index}>{formatSentence(sentence, symbolInfo)}</li>;
        })}
      </ul>
    );
  }

  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>
      {examples}
      <p>
        <button
          disabled={state.done}
          onClick={() => {
            more();
          }}
        >
          {t("analysis.generateMoreSentences")}
        </button>
      </p>
    </section>
  );
}

SentencesInternalComponent.propTypes = {
  grammar: PropTypes.shape({
    exampleSentences: PropTypes.func.isRequired,
    calculations: PropTypes.shape({
      symbolInfo: PropTypes.object.isRequired
    }).isRequired
  }).isRequired
};
