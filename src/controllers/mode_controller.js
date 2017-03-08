//= require templates/mode

const modeTemplate = require('../templates/mode.ejs');

var ModeController = function(element) {
  
  this._element = element;
  this._element.id = "mode";
  
  this._element.innerHTML = modeTemplate();
  
  $(this._element).find("#mode-edit").on("change", function(e) {
    if (e.target.checked)
      this._delegate.edit();
  }.bind(this));
  
  $(this._element).find("#mode-transform").on("change", function(e) {
    if (e.target.checked)
      this._delegate.transform();
  }.bind(this));
  
  $(this._element).find("#mode-analyze").on("click", function(e) {
    this._delegate.analyze();
  }.bind(this));
  
}

ModeController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ModeController.prototype.reload = function() {
  
  var mode = this._delegate.getMode();
  
  if (mode === "edit") {
    
    $(this._element).find("#mode-edit").get(0).checked = true;
    $(this._element).find("#mode-analyze").get(0).disabled = false;
    
  } else {
    
    $(this._element).find("#mode-transform").get(0).checked = true;
    $(this._element).find("#mode-analyze").get(0).disabled = true;
    
  }
  
}

module.exports = ModeController;
