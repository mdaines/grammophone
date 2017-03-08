//= require templates/sentences

const template = require('../templates/sentences.ejs');
const Helpers = require('../helpers');

var ShortSentencesView = function(element) {
  
  this._element = element;
  
}

ShortSentencesView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ShortSentencesView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    sentences: this._delegate.getCalculation("grammar.sentences").slice(0, 10),
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    more: this._delegate.getCalculation("grammar.sentences").length > 10,
    Helpers
  });
  
}

module.exports = ShortSentencesView;
