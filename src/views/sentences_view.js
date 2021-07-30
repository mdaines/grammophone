var template = require("../templates/sentences.ejs");
var Helpers = require('../helpers');

var SentencesView = function(element) {

  this._element = element;

}

SentencesView.prototype.setDelegate = function(delegate) {

  this._delegate = delegate;

}

SentencesView.prototype.reload = function() {

  this._element.innerHTML = template({
    sentences: this._delegate.getCalculation("grammar.sentences"),
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    more: false,
    Helpers: Helpers
  });

}

module.exports = SentencesView;
