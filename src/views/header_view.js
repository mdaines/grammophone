'use strict';

const template = require('../templates/header.ejs');
const Helpers = require('../helpers');

const HeaderView = function(element) {
  
  this._element = element;
  this._element.className = "header";
  
};

HeaderView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
};

HeaderView.prototype.reload = function() {
  
  let path = this._delegate.getPathComponents();
  
  this._element.innerHTML = template({ path: path, Helpers });
  
};

module.exports = HeaderView;
