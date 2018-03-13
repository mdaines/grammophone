'use strict';

const template = require('../templates/parsing.ejs');
const Helpers = require('../helpers');

class ParsingView {

  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    this._element.innerHTML = template({
      classification: this._delegate.getCalculation("grammar.classification"),
      Helpers
    });
  }

}

module.exports = ParsingView;
