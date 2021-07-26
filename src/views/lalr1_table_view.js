const template = require('../templates/lr1_table.ejs');
const Helpers = require('../helpers');
const Sets = require('../grammar/sets');

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
    productions: this._delegate.getCalculation("grammar.productions"),
    Helpers: Helpers,
    Sets: Sets
  });

}

module.exports = LALR1TableView;
