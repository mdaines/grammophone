import { formatSentence } from "../helpers.js";
import { makeSentencesIterator, takeFromIterator } from "../../grammar/sentences_iterator.js";
import { Component } from "preact";

class ListComponent extends Component {
  constructor(props) {
    super(props);

    this.state = { values: [], done: false };
    this.more();
  }

  more() {
    const { done, values } = takeFromIterator(this.props.iterator, 20, 1000);

    this.setState({ values: this.state.values.concat(values), done });
  }

  render({ symbolInfo }) {
    let examples;

    if (this.state.values.length == 0 && this.state.done) {
      examples = <p>{"No example sentences could be generated."}</p>;
    } else {
      examples = (
        <ul class="symbols">
          {
            this.state.values.map(function(sentence) {
              return <li>{formatSentence(sentence, symbolInfo)}</li>;
            })
          }
        </ul>
      );
    }

    return (
      <>
        {examples}
        <p><button disabled={this.state.done} onClick={() => { this.more(); }}>{"Generate more sentences"}</button></p>
      </>
    );
  }
}

export default function({ grammar }) {
  const iterator = makeSentencesIterator(grammar);
  const symbolInfo = grammar.calculate("grammar.symbolInfo");

  return (
    <>
      <h1>Example Sentences</h1>
      <ListComponent key={grammar} iterator={iterator} symbolInfo={symbolInfo} />
    </>
  );
}
