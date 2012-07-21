//= require views/edit_view

var Edit = function(element) {
  
  this._element = element;
  this._element.className = "edit";
  
  this._editElement = document.createElement("article");
  this._element.appendChild(this._editElement);
  
  this._editView = new EditView(this._editElement);
  this._editView.setDelegate(this);
  
  if (this._editView.setup)
    this._editView.setup();
  
}

Edit.prototype.specChanged = function(spec) {
  
  this._spec = spec;
  
  try {
    var grammar = Grammar.parse(spec);
    this._error = null;
    this._editView.reload();
    this._delegate.specChanged(spec, grammar);
  } catch (e) {
    this._error = e;
    this._editView.reload();
  }
  
}

Edit.prototype.getSpec = function() {
  
  return this._spec;
  
}

Edit.prototype.getError = function() {
  
  return this._error;
  
}

Edit.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Edit.prototype.reload = function() {
  
  // FIXME
  // delegate only provides spec and grammar, no error --
  // when changing hashes, the application parses the spec
  // also, which means that we end up parsing the grammar
  // a couple times...
  
  this._spec = this._delegate.getSpec();
  
  try {
    Grammar.parse(this._spec);
    this._error = null;
  } catch (e) {
    this._error = e;
  }
  
  this._editView.reload();
  
}
