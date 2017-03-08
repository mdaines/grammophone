//= require templates/header

const template = require('../templates/header.ejs');
const Helpers = require('../helpers');

var HeaderView = function(element) {
  
  this._element = element;
  this._element.className = "header";
  
}

HeaderView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

HeaderView.prototype.reload = function() {
  
  var path = this._delegate.getPathComponents();
  
  this._element.innerHTML = template({ path: path, Helpers });
  
}

module.exports = HeaderView;
