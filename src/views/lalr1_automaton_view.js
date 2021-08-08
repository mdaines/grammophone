var template = require('../templates/lr_automaton_graph.ejs');
var Helpers = require('../helpers');

module.exports = class LALR1AutomatonView {
  constructor(element) {

    this._element = element;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    var dot = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      automaton: this._delegate.getCalculation("parsing.lr.lalr1_automaton"),
      productions: this._delegate.getCalculation("grammar.productions"),
      start: this._delegate.getCalculation("grammar.start"),
      title: "LALR(1) Automaton",
      Helpers: Helpers
    });

    this._element.innerHTML = Viz(dot);

  }

}
