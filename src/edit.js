//= require templates/edit

var Edit = function(element) {
  
  this._element = element;
  this._element.id = "edit";
  
  this._element.innerHTML = JST["templates/edit"]();
  
}

Edit.prototype.getSpec = function() {
  
  return $(this._element).find(".spec").get(0).value;
  
}

Edit.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Edit.prototype.reload = function() {
  
  $(this._element).find(".spec").get(0).value = this._delegate.getSpec();
  
}
