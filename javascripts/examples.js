//= require templates/examples

var Examples = function(element) {
  
  this._element = element;
  
}

Examples.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Examples.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/examples"]();
  
}
