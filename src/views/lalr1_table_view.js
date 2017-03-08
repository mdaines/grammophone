//= require templates/lr1_table

const template = require('../templates/lr1_table.ejs');

var LALR1TableView = function(element) {
  
  this._element = element;
  
}

LALR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LALR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.lalr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
}

module.exports = LALR1TableView;
