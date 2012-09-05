//= require templates/mode

var Mode = function(element) {
  
  this._element = element;
  this._element.id = "mode";
  
  this._element.innerHTML = JST["templates/mode"]();
  
  $(this._element).find(".analyze").on("click", function(e) {
    this._delegate.analyze();
  }.bind(this));
  
}

Mode.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Mode.prototype.reload = function() {
  
}
