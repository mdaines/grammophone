'use strict';

const template = require('../templates/lr1_table.ejs');
const Helpers = require('../helpers');
const Sets = require('../sets');
const END = require('../grammar/symbols').END;

class LALR1TableView {
  
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    this._element.innerHTML = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      table: this._delegate.getCalculation("parsing.lr.lalr1_table"),
      productions: this._delegate.getCalculation("grammar.productions"),
      Helpers,
      Sets,
      END
    });
  }
  
}

module.exports = LALR1TableView;
