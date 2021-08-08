var template = require("../templates/sentences.ejs");
var Helpers = require('../helpers');

module.exports = class ShortSentencesView {
  constructor(element) {

    this._element = element;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._element.innerHTML = template({
      sentences: this._delegate.getCalculation("grammar.sentences").slice(0, 10),
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      more: this._delegate.getCalculation("grammar.sentences").length > 10,
      Helpers: Helpers
    });

  }

}
