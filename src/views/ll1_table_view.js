'use strict';

const template = require('../templates/ll1_table.ejs');
const Helpers = require('../helpers');
const Sets = require('../sets');
const END = require('../grammar/symbols').END;

const LL1TableView = function(element) {
  
  this._element = element;
  
};

LL1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
};

LL1TableView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.ll.ll1_table"),
    productions: this._delegate.getCalculation("grammar.productions"),
    Helpers,
    Sets,
    END
  });
  
};

module.exports = LL1TableView;
