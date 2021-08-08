var template = require('../templates/lr0_table.ejs');
var Helpers = require('../helpers');
var Sets = require('../sets');

module.exports = class LR0TableView {
  constructor(element) {

    this._element = element;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._element.innerHTML = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      start: this._delegate.getCalculation("grammar.start"),
      automaton: this._delegate.getCalculation("parsing.lr.lr0_automaton"),
      table: this._delegate.getCalculation("parsing.lr.lr0_table"),
      productions: this._delegate.getCalculation("grammar.productions"),
      Helpers: Helpers,
      Sets: Sets
    });

  }

}
