'use strict';

const template = require('../templates/parsing.ejs');
const Helpers = require('../helpers');

const ParsingView = function(element) {
  
  this._element = element;
  
};

ParsingView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
};

ParsingView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    classification: this._delegate.getCalculation("grammar.classification"),
    Helpers
  });
  
};

module.exports = ParsingView;
