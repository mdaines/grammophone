var template = require("../templates/parsing.ejs");
var Helpers = require('../helpers');

module.exports = class ParsingView {
  constructor(element) {

  this._element = element;

}

setDelegate(delegate) {

  this._delegate = delegate;

}

reload() {

  this._element.innerHTML = template({
    classification: this._delegate.getCalculation("grammar.classification"),
    Helpers: Helpers
  });

}

}
