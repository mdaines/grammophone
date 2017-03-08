//= require templates/lr1_table

const template = require('../templates/lr1_table.ejs');
const Helpers = require('../helpers');
const Set = require('../set');

var LR1TableView = function(element) {
  
  this._element = element;
  
}

LR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.lr1_table"),
    productions: this._delegate.getCalculation("grammar.productions"),
    Helpers,
    Set
  });
  
}

module.exports = LR1TableView;
