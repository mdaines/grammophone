const { render } = require("preact");
const ApplicationComponent = require("../components/application_component.js");

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

    this._render();
  }

  _render() {
    render(
      <ApplicationComponent
        spec={this._spec}
        error={this._parse.error}
        grammar={this._parse.grammar}
        path={this._path}
        mode={this._mode}
        transformStack={this._transformStack}
        transformIndex={this._transformIndex}
        updateSpec={(newValue) => { this._spec = newValue; }}
        edit={() => this.edit()}
        transform={() => this.transform()}
        analyze={() => this.analyze()}
        undoTransformation={() => { this.undoTransformation(); }}
        redoTransformation={() => { this.redoTransformation(); }}
        applyTransformation={(t) => { this.applyTransformation(t); }}
      />,
      this._element
    );
  }

  _hashChanged() {
    this._path = window.location.hash.slice(1);

    if (this._path == "") {
      this._path = "/";
    }

    this._render();
  }

  undoTransformation() {
    if (this._transformIndex > 0) {
      this._transformIndex -= 1;
      this._parse = { grammar: this._transformStack[this._transformIndex].grammar };
      this._spec = this._transformStack[this._transformIndex].grammar.toString();

      this._render();
    }
  }

  redoTransformation() {
    if (this._transformIndex < this._transformStack.length - 1) {
      this._transformIndex += 1;
      this._parse = { grammar: this._transformStack[this._transformIndex].grammar };
      this._spec = this._transformStack[this._transformIndex].grammar.toString();

      this._render();
    }
  }

  applyTransformation(transformation) {
    const item = {
      grammar: this._parse.grammar.transform(transformation),
      transformation: transformation
    };

    this._transformIndex += 1;
    this._transformStack.splice(this._transformIndex, this._transformStack.length - this._transformIndex, item);

    this._parse = { grammar: this._transformStack[this._transformIndex].grammar };
    this._spec = this._transformStack[this._transformIndex].grammar.toString();

    this._render();
  }

  analyze() {
    this._parse = parse(this._spec);
    this._render();
  }

  transform() {
    this._parse = parse(this._spec);

    if (typeof this._parse.error === "undefined" && typeof this._parse.grammar !== "undefined") {
      this._mode = "transform";

      this._transformStack = [{ grammar: this._parse.grammar }];
      this._transformIndex = 0;
    }

    this._render();
  }

  edit() {
    this._mode = "edit";
    this._render();
  }
}
