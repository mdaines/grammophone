//= require templates/header

var HeaderView = function(element) {
  
  this._element = element;
  this._element.className = "header";
  
}

HeaderView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

HeaderView.prototype.reload = function() {
  
  var path = this._delegate.getPathComponents();
  
  this._element.innerHTML = JST["templates/header"]({ path: path });
  
}
