//= require templates/mode

var ModeController = function(element) {
  
  this._element = element;
  this._element.id = "mode";
  
  this._element.innerHTML = JST["templates/mode"]();
  
  this._element.querySelector("#mode-edit").addEventListener("change", function(e) {
    if (e.target.checked)
      this._delegate.edit();
  }.bind(this));
  
  this._element.querySelector("#mode-transform").addEventListener("change", function(e) {
    if (e.target.checked)
      this._delegate.transform();
  }.bind(this));
  
  this._element.querySelector("#mode-analyze").addEventListener("click", function(e) {
    this._delegate.analyze();
  }.bind(this));
  
}

ModeController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ModeController.prototype.reload = function() {
  
  var mode = this._delegate.getMode();
  
  if (mode === "edit") {
    
    this._element.querySelector("#mode-edit").checked = true;
    this._element.querySelector("#mode-analyze").disabled = false;
    
  } else {
    
    this._element.querySelector("#mode-transform").checked = true;
    this._element.querySelector("#mode-analyze").disabled = true;
    
  }
  
}
