//= require zepto
//= require viz
//= require analysis
//= require edit
//= require transform
//= require mode
//= require error_controller
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
  
  this._masterElement = document.createElement("div");
  this._masterElement.id = "master";
  this._element.appendChild(this._masterElement);
  
  // edit
  
  this._editElement = document.createElement("section");
  this._masterElement.appendChild(this._editElement);
  
  this._edit = new Edit(this._editElement);
  this._edit.setDelegate(this);
  
  // mode
  
  this._modeElement = document.createElement("section");
  this._masterElement.appendChild(this._modeElement);
  
  this._mode = new Mode(this._modeElement);
  this._mode.setDelegate(this);
  
  // error
  
  this._errorElement = document.createElement("section");
  this._masterElement.appendChild(this._errorElement);
  
  this._error = new ErrorController(this._errorElement);
  this._error.setDelegate(this);
  
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
  this._mode.reload();
  this._error.reload();
  
  this._layout();
  
}

Application.prototype._hashChanged = function() {
  
  // get grammar and path
  
  this._path = window.location.hash.slice(1);
  
  if (this._path == "")
    this._path = "/";
  
  // update controllers
  
  this._analysis.reload();
  
}

Application.prototype._layout = function() {
  
  $(this._editElement).css({ bottom: $(this._modeElement).height() + "px" });
  
  if (typeof this._parse.error === "undefined") {
    
    $(this._errorElement).hide();
    $(this._editElement).css({ top: "0" });
    
  } else {
    
    $(this._errorElement).show();
    $(this._editElement).css({ top: $(this._errorElement).height() + "px" });
    
  }
  
  
}

Application.prototype.getPath = function() {
  
  return this._path;
  
}

Application.prototype.getGrammar = function() {
  
  return this._parse.grammar;
  
}

Application.prototype.getSpec = function() {
  
  return this._parse.spec;
  
}

Application.prototype.getError = function() {
  
  return this._parse.error;
  
}

Application.prototype.analyze = function() {
  
  this._parse = Grammar.parse(this._edit.getSpec());
  
  if (typeof this._parse.error === "undefined")
    this._analysis.reload();
  
  this._error.reload();
  
  this._layout();
  
}

Application.prototype.buildHref = function(path) {
  
  return "#" + path;
  
}
