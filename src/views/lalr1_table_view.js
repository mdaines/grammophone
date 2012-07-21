//= require templates/lr1_table

var LALR1TableView = function(element) {
  
  this._element = element;
  
}

LALR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LALR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.lalr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
}
