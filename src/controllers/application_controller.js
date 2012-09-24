//= require controllers/analysis_controller
//= require controllers/edit_controller
//= require controllers/transform_controller
//= require controllers/mode_controller
//= require controllers/error_controller
//= require controllers/transform_controller

Function.prototype.bind = function(context) {
  var fn = this;
  return function() { return fn.apply(context, arguments); };
}

Function.prototype.defer = function() {
  setTimeout(this, 0);
}

var ApplicationController = function(element) {
  
  this._element = element;
  
  // helpers
  
  Helpers.setDelegate(this);
  
  this._masterElement = document.createElement("div");
  this._masterElement.id = "master";
  this._element.appendChild(this._masterElement);
  
  // edit
  
  this._editElement = document.createElement("section");
  this._masterElement.appendChild(this._editElement);
  
  this._editController = new EditController(this._editElement);
  this._editController.setDelegate(this);
  
  // mode
  
  this._modeElement = document.createElement("section");
  this._masterElement.appendChild(this._modeElement);
  
  this._modeController = new ModeController(this._modeElement);
  this._modeController.setDelegate(this);
  
  // error
  
  this._errorElement = document.createElement("section");
  this._masterElement.appendChild(this._errorElement);
  
  this._errorController = new ErrorController(this._errorElement);
  this._errorController.setDelegate(this);
  
  // analysis
  
  this._analysisElement = document.createElement("section");
  this._element.appendChild(this._analysisElement);
  
  this._analysisController = new AnalysisController(this._analysisElement);
  this._analysisController.setDelegate(this);
  
  // analysis
  
  this._transformElement = document.createElement("section");
  this._masterElement.appendChild(this._transformElement);
  
  this._transformController = new TransformController(this._transformElement);
  this._transformController.setDelegate(this);
  
  // listen for hashchange events
  
  window.location.hash = "";
  
  window.addEventListener("hashchange", function() {
    this._hashChanged();
  }.bind(this));
  
  // set initial path and parse, and reload children
  
  this._path = "/";
  this._parse = { spec: "" };
  this._mode = "edit";
  
  this._analysisController.reload();
  this._editController.reload();
  this._modeController.reload();
  
  if (this._mode === "edit")
    this._errorController.reload();
  else
    this._transformController.reload();
  
  this._layout();
  
}

ApplicationController.prototype._hashChanged = function() {
  
  // get grammar and path
  
  this._path = window.location.hash.slice(1);
  
  if (this._path == "")
    this._path = "/";
  
  // update controllers
  
  this._analysisController.reload();
  
}

ApplicationController.prototype._layout = function() {
  
  if (this._mode === "edit") {
    
    $(this._editElement).show();
    $(this._transformElement).hide();
  
    if (typeof this._parse.error === "undefined") {
    
      $(this._errorElement).hide();
      $(this._editElement).css({ top: $(this._modeElement).height() + "px" });
    
    } else {
    
      $(this._errorElement).show();
      $(this._errorElement).css({ top: $(this._modeElement).height() + "px" });
      $(this._editElement).css({ top: $(this._modeElement).height() + $(this._errorElement).height() + "px" });
    
    }
    
  } else {
    
    $(this._editElement).hide();
    $(this._errorElement).hide();
    $(this._transformElement).show();
  
    $(this._transformElement).css({ top: $(this._modeElement).height() + "px" });
    
  }
  
}

ApplicationController.prototype.getPath = function() {
  
  return this._path;
  
}

ApplicationController.prototype.getGrammar = function() {
  
  return this._parse.grammar;
  
}

ApplicationController.prototype.getSpec = function() {
  
  return this._parse.spec;
  
}

ApplicationController.prototype.getError = function() {
  
  return this._parse.error;
  
}

ApplicationController.prototype.getMode = function() {
  
  return this._mode;
  
}

ApplicationController.prototype.grammarChanged = function(grammar) {
  
  this._parse = { grammar: grammar, spec: grammar.toString() };
  
  this._analysisController.reload();
  this._layout();
  
}

ApplicationController.prototype.analyze = function() {
  
  this._parse = Grammar.parse(this._editController.getSpec());
  
  if (typeof this._parse.error === "undefined")
    this._analysisController.reload();
  
  this._errorController.reload();
  this._layout();
  
}

ApplicationController.prototype.transform = function() {
  
  this._parse = Grammar.parse(this._editController.getSpec());
  
  if (typeof this._parse.error === "undefined" && typeof this._parse.grammar !== "undefined") {
    this._mode = "transform";
    this._transformController.reload();
  }
  
  this._analysisController.reload();
  this._errorController.reload();
  this._modeController.reload();
  this._layout();
  
}

ApplicationController.prototype.edit = function() {
  
  this._mode = "edit";
  
  this._analysisController.reload();
  this._editController.reload();
  this._modeController.reload();
  this._layout();
  
}

ApplicationController.prototype.buildHref = function(path) {
  
  return "#" + path;
  
}
