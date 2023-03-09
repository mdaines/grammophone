import { formatSentence } from "../helpers.js";
import { makeSentencesIterator, takeFromIterator } from "../../grammar/sentences_iterator.js";
import { Component } from "react";

function takePage(iterator) {
  return takeFromIterator(iterator, 20, 1000);
}

export default class ListComponent extends Component {
  constructor(props) {
    super(props);

    const iterator = makeSentencesIterator(this.props.grammar);

    this.state = { iterator, sentences: takePage(iterator) };
  }

  more() {
    const { values, done } = takePage(this.state.iterator);
    const sentences = { values: this.state.sentences.values.concat(values), done };

    this.setState({ ...this.state, sentences });
  }

  render() {
    const symbolInfo = this.props.grammar.calculate("grammar.symbolInfo");

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
      <>
        <h1>Example Sentences</h1>
        {examples}
        <p><button disabled={this.state.done} onClick={() => { this.more(); }}>{"Generate more sentences"}</button></p>
      </>
    );
  }
}
