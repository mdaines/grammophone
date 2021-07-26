const editTemplate = require("../templates/edit.ejs");

var EditController = function(element) {

  this._element = element;
  this._element.id = "edit";

  this._element.innerHTML = editTemplate();

}

EditController.prototype.getSpec = function() {

  return this._element.querySelector(".spec").value;

}

EditController.prototype.setDelegate = function(delegate) {

  this._delegate = delegate;

}

EditController.prototype.reload = function() {

  this._element.querySelector(".spec").value = this._delegate.getSpec();

}

module.exports = EditController;
