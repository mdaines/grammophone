//= require views/edit_view

var Edit = function(element) {
  
  this._element = element;
  this._element.id = "edit";
  
  this._editElement = document.createElement("article");
  this._element.appendChild(this._editElement);
  
  this._editView = new EditView(this._editElement);
  this._editView.setDelegate(this);
  
  if (this._editView.setup)
    this._editView.setup();
  
}

Edit.prototype.specChanged = function(spec) {
  
  this._parse = Grammar.parse(spec);
  
  if (typeof this._parse.error === "undefined")
    this._delegate.parseChanged(this._parse);
  
  this._editView.reload();
  
}

Edit.prototype.getSpec = function() {
  
  return this._parse.spec;
  
}

Edit.prototype.getError = function() {
  
  return this._parse.error;
  
}

Edit.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Edit.prototype.reload = function() {
  
  this._parse = this._delegate.getParse();
  this._editView.reload();
  
}
