//= require templates/edit

var EditController = function(element) {
  
  this._element = element;
  this._element.id = "edit";
  
  this._element.innerHTML = JST["templates/edit"]();
  
}

EditController.prototype.getSpec = function() {
  
  return $(this._element).find(".spec").get(0).value;
  
}

EditController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

EditController.prototype.reload = function() {
  
  $(this._element).find(".spec").get(0).value = this._delegate.getSpec();
  
}
