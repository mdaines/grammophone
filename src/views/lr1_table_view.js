//= require templates/lr1_table

var LR1TableView = function(element) {
  
  this._element = element;
  
}

LR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.lr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
}
