//= require templates/edit

var EditView = function(element) {
  
  this._element = $(element);
  
}

EditView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

EditView.prototype.setup = function() {
  
  this._element.get(0).innerHTML = JST["templates/edit"]();
  
  this._element.find(".analyze").on("click", function() {
    this._delegate.specChanged(this._element.find(".spec").get(0).value);
  }.bind(this));
  
}

EditView.prototype.reload = function() {
  
  this._element.find(".spec").get(0).value = this._delegate.getSpec();
  
  // FIXME
  // need better error display.
  
  var error = this._delegate.getError();
  
  if (error) {
    this._element.find(".errors").get(0).innerHTML = "<pre>" + error + "</pre>";
    this._element.addClass("error");
  } else {
    this._element.find(".errors").get(0).innerHTML = "";
    this._element.removeClass("error");
  }
  
}
