var template = require("../templates/nonterminals.ejs");
var Helpers = require('../helpers');

module.exports = class NonterminalsView {
  constructor(element) {

    this._element = element;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._element.innerHTML = template({
      nullable: this._delegate.getCalculation("grammar.nullable"),
      endable: this._delegate.getCalculation("grammar.endable"),
      first: this._delegate.getCalculation("grammar.first"),
      follow: this._delegate.getCalculation("grammar.follow"),
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      Helpers: Helpers
    });

  }

}
