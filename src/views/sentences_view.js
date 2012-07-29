//= require templates/sentences

var SentencesView = function(element) {
  
  this._element = element;
  
}

SentencesView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SentencesView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/sentences"]({
    sentences: this._delegate.getCalculation("grammar.sentences"),
    info: this._delegate.getCalculation("grammar.symbolInfo")
  });
  
}
