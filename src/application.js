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
  
  // examples
  
  this._examplesElement = document.createElement("section");
  this._element.appendChild(this._examplesElement);
  
  this._examples = new Examples(this._examplesElement);
  this._examples.setDelegate(this);
  
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
    this._handleHashChange();
  }.bind(this));
  
  this._handleHashChange();
  
}

Application.prototype._handleHashChange = function() {
  
  // get grammar and path
  
  var hash = window.location.hash.slice(1);
  var components = hash.split("/");
  
  if (components.length === 0) {
    
    this._spec = undefined;
    this._grammar = undefined;
    this._path = undefined;
    
  } else {
    
    this._spec = unescape(components[0]);
    
    try {
      this._grammar = Grammar.parse(this._spec);
    } catch (e) {
      this._grammar = undefined;
    }
    
    this._path = "/" + components.slice(1).join("/");
    
    var f = this._path.indexOf("~");
    
    if (f !== -1) {
      this._fragment = this._path.slice(f + 1);
      this._path = this._path.slice(0, f);
    } else {
      this._fragment = undefined;
    }
    
  }
  
  // update controllers
  
  this._analysis.reload();
  this._edit.reload();
  this._examples.reload();
  
  // handle fragments
  
  var element, rect;

  if (this._fragment && (element = document.getElementById(this._fragment))) {
  
    var rect = element.getBoundingClientRect();
    window.scrollTo(0, rect.top + window.pageYOffset);
  
  } else {
    
    window.scrollTo(0, 0);
  
  }
  
}

Application.prototype.getGrammar = function() {
  
  return this._grammar;
  
}

Application.prototype.getPath = function() {
  
  return this._path;
  
}

Application.prototype.getSpec = function() {
  
  return this._spec;
  
}

Application.prototype.specChanged = function(spec, grammar) {
  
  this._spec = spec;
  this._grammar = grammar;
  
  // update hash, but no fragment is included
  
  window.location.hash = escape(this._spec) + (typeof this._path !== "undefined" && this._path !== null ? this._path : "");
  
}

Application.prototype.buildHref = function(path, fragment) {
  
  return "#" + escape(this._spec) + path + (typeof fragment !== "undefined" && fragment !== null ? "~" + fragment : "");
  
}
