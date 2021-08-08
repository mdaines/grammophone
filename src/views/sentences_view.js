var template = require("../templates/sentences.ejs");
var Helpers = require('../helpers');

module.exports = class SentencesView {
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
      Helpers: Helpers
    });

  }

}
