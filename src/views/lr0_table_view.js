//= require templates/lr0_table

const template = require('../templates/lr0_table.ejs');
const Helpers = require('../helpers');
const Sets = require('../sets');

var LR0TableView = function(element) {
  
  this._element = element;
  
}

LR0TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR0TableView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    start: this._delegate.getCalculation("grammar.start"),
    automaton: this._delegate.getCalculation("parsing.lr.lr0_automaton"),
    table: this._delegate.getCalculation("parsing.lr.lr0_table"),
    productions: this._delegate.getCalculation("grammar.productions"),
    Helpers,
    Sets
  });
  
}

module.exports = LR0TableView;
