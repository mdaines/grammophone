'use strict';

const template = require('../templates/lr0_table.ejs');
const Helpers = require('../helpers');
const Sets = require('../sets');

class LR0TableView {

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
      Helpers,
      Sets
    });
  }

}

module.exports = LR0TableView;
