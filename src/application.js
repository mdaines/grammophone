//= require zepto
//= require analysis
//= require edit
//= require examples
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
  
  // listen for hashchange events and call the handler
  
  window.addEventListener("hashchange", function() {
    this._hashChanged();
  }.bind(this));
  
  this._hashChanged();
  
}

Application.prototype._hashChanged = function() {
  
  // get grammar and path
  
  var hash = window.location.hash.slice(1);
  var components = hash.split("/");
  
  if (components.length === 0) {
    
    this._parse = Grammar.parse("");
    
  } else {
    
    this._parse = Grammar.parse(unescape(components[0]));
    this._path = "/" + components.slice(1).join("/");
    
  }
  
  // update controllers
  
  this._analysis.reload();
  this._edit.reload();
  
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
  window.location.hash = escape(this._parse.spec) + (typeof this._path !== "undefined" && this._path !== null ? this._path : "");
  
}

Application.prototype.buildHref = function(path) {
  
  return "#" + escape(this._parse.spec) + path;
  
}
