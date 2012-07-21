//= require templates/lr1_table

var SLR1TableView = function(element) {
  
  this._element = element;
  
}

SLR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SLR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.slr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
}
