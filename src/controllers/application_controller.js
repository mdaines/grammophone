'use strict';

const AnalysisController = require('./analysis_controller');
const EditController = require('./edit_controller');
const TransformController = require('./transform_controller');
const ModeController = require('./mode_controller');
const ErrorController = require('./error_controller');
const Helpers = require('../helpers');
const Grammar = require('../grammar');

class ApplicationController {
  
  constructor(element) {
    this._element = element;
  
    // helpers
  
    Helpers.setDelegate(this);
  
    // master
  
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
  
    // transform
  
    this._transformElement = document.createElement("section");
    this._masterElement.appendChild(this._transformElement);
  
    this._transformController = new TransformController(this._transformElement);
    this._transformController.setDelegate(this);
  
    // analysis
  
    this._analysisElement = document.createElement("section");
    this._element.appendChild(this._analysisElement);
  
    this._analysisController = new AnalysisController(this._analysisElement);
    this._analysisController.setDelegate(this);
  
    // listen for hashchange events
  
    window.location.hash = "";
  
    $(window).on("hashchange", () => {
      this._hashChanged();
    });
  
    // set initial path and parse, and reload children
  
    this._path = "/";
    this._parse = { spec: "# Type a grammar here:\n\n" };
    this._mode = "edit";
  
    this._analysisController.reload();
    this._editController.reload();
    this._modeController.reload();
  
    if (this._mode === "edit") {
      this._errorController.reload();
    } else {
      this._transformController.reload();
    }
  
    this._layout();
  }

  _hashChanged() {
    // get grammar and path
  
    this._path = window.location.hash.slice(1);
  
    if (this._path === "") {
      this._path = "/";
    }
  
    // update controllers
  
    this._analysisController.reload();
  }

  _layout() {
    if (this._mode === "edit") {
      $(this._editElement).show();
      $(this._transformElement).hide();
  
      if (typeof this._parse.error === "undefined") {
        $(this._errorElement).hide();
        $(this._editElement).css({ top: $(this._modeElement).outerHeight() + "px" });
      } else {
        $(this._errorElement).show();
        $(this._errorElement).css({ top: $(this._modeElement).outerHeight() + "px" });
        $(this._editElement).css({ top: $(this._modeElement).outerHeight() + $(this._errorElement).outerHeight() + "px" });
      }
    } else {
      $(this._editElement).hide();
      $(this._errorElement).hide();
      $(this._transformElement).show();
  
      $(this._transformElement).css({ top: $(this._modeElement).outerHeight() + "px" });
    }
  }

  getPath() {
    return this._path;
  }

  getGrammar() {
    return this._parse.grammar;
  }

  getSpec() {
    return this._parse.spec;
  }

  getError() {
    return this._parse.error;
  }

  getMode() {
    return this._mode;
  }

  grammarChanged(grammar) {
    this._parse = { grammar: grammar, spec: grammar.toString() };
  
    this._analysisController.reload();
    this._layout();
  }

  analyze() {
    this._parse = Grammar.parse(this._editController.getSpec());
  
    if (typeof this._parse.error === "undefined") {
      this._analysisController.reload();
    }
  
    this._errorController.reload();
    this._layout();
  }

  transform() {
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

  edit() {
    this._mode = "edit";
  
    this._analysisController.reload();
    this._editController.reload();
    this._modeController.reload();
    this._layout();
  }

  buildHref(path) {
    return "#" + path;
  }

}

module.exports = ApplicationController;
