//= require templates/ll1_table

const Helpers = require('../helpers');
const Set = require('../set');

var LL1TableView = function(element) {
  
  this._element = element;
  
}

LL1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LL1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/ll1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.ll.ll1_table"),
    productions: this._delegate.getCalculation("grammar.productions"),
    Helpers,
    Set
  });
  
}

module.exports = LL1TableView;
