//= require templates/lr1_table

const template = require('../templates/lr1_table.ejs');
const Helpers = require('../helpers');
const Sets = require('../sets');

var SLR1TableView = function(element) {
  
  this._element = element;
  
}

SLR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SLR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.slr1_table"),
    productions: this._delegate.getCalculation("grammar.productions"),
    Helpers,
    Sets
  });
  
}

module.exports = SLR1TableView;
