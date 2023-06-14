import { formatSentence } from "../helpers.js";
import { takeFromIterator } from "../../grammar/sentences.js";
import { Component } from "react";

function takePage(iterator) {
  return takeFromIterator(iterator, 20, 1000);
}

export const ID = "sentences";
export const TITLE = "Example Sentences";

class SentencesInternalComponent extends Component {
  constructor(props) {
    super(props);

    const iterator = this.props.grammar.exampleSentences();

    this.state = { iterator, sentences: takePage(iterator) };
  }

  more() {
    const { values, done } = takePage(this.state.iterator);
    const sentences = { values: this.state.sentences.values.concat(values), done };

    this.setState({ ...this.state, sentences });
  }

  render() {
    const { symbolInfo } = this.props.grammar.calculations;

    let examples;

    if (this.state.sentences.values.length == 0 && this.state.sentences.done) {
      examples = <p>{"No example sentences could be generated."}</p>;
    } else {
      examples = (
        <ul className="symbols">
          {
            this.state.sentences.values.map((sentence, index) => {
              return <li key={index}>{formatSentence(sentence, symbolInfo)}</li>;
            })
          }
        </ul>
      );
    }

    return (
      <section id={ID} className="analysis">
        <h2>{TITLE}</h2>
        {examples}
        <p><button disabled={this.state.done} onClick={() => { this.more(); }}>{"Generate more sentences"}</button></p>
      </section>
    );
  }
}

export default function({ grammar }) {
  return <SentencesInternalComponent key={grammar} grammar={grammar} />;
}
