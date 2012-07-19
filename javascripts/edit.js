//= require templates/edit

var Edit = function(element) {
  
  this._element = element;
  
  // set up the element
  
  this._element.innerHTML = JST["templates/edit"]();
  
  this._element.getElementsByTagName("button").item(0).addEventListener("click", function() {
    this._handleAnalyze();
  }.bind(this));
  
}

Edit.prototype._handleAnalyze = function() {
  
  var spec = this._element.getElementsByTagName("textarea").item(0).value;
  
  try {
    Grammar.parse(spec);
    this._delegate.specChanged(spec);
  } catch (e) {
    console.log("invalid spec");
  }
  
}

Edit.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Edit.prototype.reload = function() {
  
  this._spec = this._delegate.getSpec();
  this._element.getElementsByTagName("textarea").item(0).value = this._spec;
  
}
