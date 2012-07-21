//= require templates/sanity

var SanityView = function(element) {
  
  this._element = element;
  
}

SanityView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SanityView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/sanity"]({
    unreachable: this._delegate.getCalculation("grammar.unreachable"),
    unrealizable: this._delegate.getCalculation("grammar.unrealizable"),
    cycle: this._delegate.getCalculation("grammar.cycle"),
    nullAmbiguity: this._delegate.getCalculation("grammar.nullAmbiguity"),
    productions: this._delegate.getCalculation("grammar.productions"),
    info: this._delegate.getCalculation("grammar.symbolInfo")
  });
  
}
