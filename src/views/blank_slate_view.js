var template = require('../templates/blank_slate.ejs');

var BlankSlateView = function(element) {

  this._element = element;
  this._element.className = "blank-slate";

}

BlankSlateView.prototype.setDelegate = function(delegate) {

  this._delegate = delegate;

}

BlankSlateView.prototype.reload = function() {

  this._element.innerHTML = template({});

}

module.exports = BlankSlateView;
