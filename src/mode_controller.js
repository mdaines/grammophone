//= require templates/mode

var ModeController = function(element) {
  
  this._element = element;
  this._element.id = "mode";
  
  this._element.innerHTML = JST["templates/mode"]();
  
  $(this._element).find(".edit").on("click", function(e) {
    this._delegate.edit();
  }.bind(this));
  
  $(this._element).find(".transform").on("click", function(e) {
    this._delegate.transform();
  }.bind(this));
  
  $(this._element).find(".analyze").on("click", function(e) {
    this._delegate.analyze();
  }.bind(this));
  
}

ModeController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ModeController.prototype.reload = function() {
  
  var mode = this._delegate.getMode();
  
  if (mode === "edit") {
    
    $(this._element).find(".edit").hide();
    $(this._element).find(".transform").show();
    $(this._element).find(".analyze").show();
    
  } else {
    
    $(this._element).find(".edit").show();
    $(this._element).find(".transform").hide();
    $(this._element).find(".analyze").hide();
    
  }
  
}
