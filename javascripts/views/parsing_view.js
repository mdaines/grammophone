//= require templates/parsing

var ParsingView = function(element) {
  
  this._element = element;
  
}

ParsingView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ParsingView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/parsing"]({
    classification: this._delegate.getCalculation("grammar.classification")
  });
  
}
