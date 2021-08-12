const template = require("../templates/lr_automaton_graph");

module.exports = class LR1AutomatonView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let dot = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      automaton: this._delegate.getCalculation("parsing.lr.lr1_automaton"),
      productions: this._delegate.getCalculation("grammar.productions"),
      start: this._delegate.getCalculation("grammar.start"),
      title: "LR(1) Automaton"
    });

    this._element.innerHTML = Viz(dot);
  }
}
