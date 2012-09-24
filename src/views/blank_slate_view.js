//= require templates/blank_slate

var BlankSlateView = function(element) {
  
  this._element = element;
  this._element.className = "blank-slate";
  
}

BlankSlateView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

BlankSlateView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/blank_slate"]({});
  
}
