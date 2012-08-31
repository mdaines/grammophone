//= require zepto
//= require viz
//= require analysis
//= require edit
//= require transform
//= require helpers
//= require set
//= require grammar

Function.prototype.bind = function(context) {
  var fn = this;
  return function() { return fn.apply(context, arguments); };
}

Function.prototype.defer = function() {
  setTimeout(this, 0);
}

var Application = function(element) {
  
  this._element = element;
  
  // helpers
  
  Helpers.setDelegate(this);
  
  // edit
  
  this._editElement = document.createElement("section");
  this._element.appendChild(this._editElement);
  
  this._edit = new Edit(this._editElement);
  this._edit.setDelegate(this);
  
  // analysis
  
  this._analysisElement = document.createElement("section");
  this._element.appendChild(this._analysisElement);
  
  this._analysis = new Analysis(this._analysisElement);
  this._analysis.setDelegate(this);
  
  // listen for hashchange events
  
  window.location.hash = "";
  
  window.addEventListener("hashchange", function() {
    this._hashChanged();
  }.bind(this));
  
  // set initial path and parse, and reload children
  
  this._path = "/";
  this._parse = { spec: "" };
  
  this._analysis.reload();
  this._edit.reload();
  
}

Application.prototype._hashChanged = function() {
  
  // get grammar and path
  
  this._path = window.location.hash.slice(1);
  
  if (this._path == "")
    this._path = "/";
  
  // update controllers
  
  this._analysis.reload();
  
}

Application.prototype.getGrammar = function() {
  
  return this._parse.grammar;
  
}

Application.prototype.getPath = function() {
  
  return this._path;
  
}

Application.prototype.getParse = function() {
  
  return this._parse;
  
}

Application.prototype.parseChanged = function(parse) {
  
  this._parse = parse;
  
  this._analysis.reload();
  
}

Application.prototype.buildHref = function(path) {
  
  return "#" + path;
  
}
