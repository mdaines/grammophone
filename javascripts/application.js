//= require analysis
//= require examples
//= require helpers
//= require set
//= require grammar

var Application = function(element) {
  
  this._element = element;
  
  // grammar and path
  
  var components = window.location.hash.slice(1).split("/");
  
  if (components[components.length - 1] != "")
    components.push("");
  
  try {
    this._grammar = Grammar.parse(unescape(components[0]));
  } catch (e) {
    this._grammar = undefined;
  }
  
  this._path = "/" + components[1];
  
  // set up examples
  
  this._examplesElement = document.createElement("section");
  this._element.appendChild(this._examplesElement);
  
  this._examples = new Examples(this._examplesElement);
  this._examples.setDelegate(this);
  this._examples.reload();
  
  // set up analysis
  
  this._analysisElement = document.createElement("section");
  this._element.appendChild(this._analysisElement);
  
  this._analysis = new Analysis(this._analysisElement);
  this._analysis.setDelegate(this);
  this._analysis.reload();
  
}

Application.prototype.getGrammar = function() {
  
  return this._grammar;
  
}

Application.prototype.getPath = function() {
  
  return this._path;
  
}
