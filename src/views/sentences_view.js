'use strict';

const template = require('../templates/sentences.ejs');
const Helpers = require('../helpers');

class SentencesView {

  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    this._element.innerHTML = template({
      sentences: this._delegate.getCalculation("grammar.sentences"),
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      more: false,
      Helpers
    });
  }

}

module.exports = SentencesView;
