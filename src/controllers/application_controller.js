const { render } = require("preact");
const EditComponent = require("../components/edit_component.js");
const ErrorComponent = require("../components/error_component.js");
const AnalysisComponent = require("../components/analysis_component.js");
const ModeComponent = require("../components/mode_component.js");

var TransformController = require("./transform_controller");
var Grammar = require("../grammar");
var parser = require("../parser");

function parse(spec) {
  if (spec.match(/^\s*$/)) {
    return { };
  }

  try {
    return { grammar: new Grammar(parser(spec)) };
  } catch (e) {
    return { error: e };
  }
}

module.exports = class ApplicationController {
  constructor(element) {

    this._element = element;

    // master

    this._masterElement = document.createElement("div");
    this._masterElement.id = "master";
    this._element.appendChild(this._masterElement);

    // edit

    this._editElement = document.createElement("section");
    this._editElement.id = "edit";
    this._masterElement.appendChild(this._editElement);

    // mode

    this._modeElement = document.createElement("section");
    this._modeElement.id = "mode";
    this._masterElement.appendChild(this._modeElement);

    // error

    this._errorElement = document.createElement("section");
    this._errorElement.id = "error";
    this._masterElement.appendChild(this._errorElement);

    // transform

    this._transformElement = document.createElement("section");
    this._masterElement.appendChild(this._transformElement);

    this._transformController = new TransformController(this._transformElement);
    this._transformController.setDelegate(this);

    // analysis

    this._analysisElement = document.createElement("section");
    this._analysisElement.id = "analysis";
    this._element.appendChild(this._analysisElement);

    // listen for hashchange events

    window.location.hash = "";

    window.addEventListener("hashchange", function() {
      this._hashChanged();
    }.bind(this), false);

    // set initial path and parse, and reload children

    this._path = "/";
    this._spec = "# Type a grammar here:\n\n";
    this._parse = {};
    this._mode = "edit";

    if (this._mode === "transform") {
      this._transformController.reload();
    }

    this._render();

    this._layout();
  }

  _render() {
    render(<EditComponent spec={this._spec} specChanged={(newValue) => { this._spec = newValue; }} />, this._editElement);
    render(<ErrorComponent error={this._parse.error} />, this._errorElement);
    render(<AnalysisComponent grammar={this._parse.grammar} path={this._path} />, this._analysisElement);
    render(<ModeComponent mode={this._mode} edit={() => this.edit()} transform={() => this.transform()} analyze={() => this.analyze()} />, this._modeElement);
  }

  _hashChanged() {

    // get grammar and path

    this._path = window.location.hash.slice(1);

    if (this._path == "") {
      this._path = "/";
    }

    // update controllers

    this._render();

  }

  _layout() {

    if (this._mode === "edit") {

      this._editElement.style.display = '';
      this._transformElement.style.display = 'none';

      if (typeof this._parse.error === "undefined") {

        this._errorElement.style.display = 'none';
        this._editElement.style.top = this._modeElement.offsetHeight + "px";

      } else {

        this._errorElement.style.display = '';
        this._errorElement.style.top = this._modeElement.offsetHeight + "px";
        this._editElement.style.top = (this._modeElement.offsetHeight + this._errorElement.offsetHeight) + "px";

      }

    } else {

      this._editElement.style.display = 'none';
      this._errorElement.style.display = 'none';
      this._transformElement.style.display = '';

      this._transformElement.style.top = this._modeElement.offsetHeight + "px";

    }

  }

  getPath() {

    return this._path;

  }

  getGrammar() {

    return this._parse.grammar;

  }

  getMode() {

    return this._mode;

  }

  grammarChanged(grammar) {

    this._parse = { grammar: grammar };
    this._spec = grammar.toString();

    this._render();
    this._layout();

  }

  analyze() {

    this._parse = parse(this._spec);

    this._render();
    this._layout();

  }

  transform() {

    this._parse = parse(this._spec);

    if (typeof this._parse.error === "undefined" && typeof this._parse.grammar !== "undefined") {
      this._mode = "transform";
      this._transformController.reload();
    }

    this._render();
    this._layout();

  }

  edit() {

    this._mode = "edit";

    this._render();
    this._layout();

  }
}
