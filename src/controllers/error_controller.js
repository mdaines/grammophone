var ErrorController = function(element) {
  
  this._element = element;
  this._element.id = "error";
  
}

ErrorController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ErrorController.prototype.reload = function() {
  
  var error = this._delegate.getError();
  
  if (typeof error !== "undefined")
    this._element.innerHTML = "<pre>" + this._delegate.getError() + "</pre>";
  else
    this._element.innerHTML = "";
  
}
