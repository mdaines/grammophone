const { render } = require("preact");
const ApplicationComponent = require("../components/application_component.js");
const Grammar = require("../grammar");
const parser = require("../parser");

function reducer(state, action) {
  switch (action.type) {
  case "setSpec":
    return { ...state, spec: action.spec };

  case "analyze":
    try {
      const grammar = new Grammar(parser(state.spec));

      return { ...state, grammar, error: null };
    } catch (e) {
      return { ...state, error: e };
    }

  case "setPath":
    return { ...state, path: action.path };

  default:
    throw `Unhandled action type ${action.type}`;
  }
}

function init(spec = "") {
  return { spec: spec, path: "/" };
}

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

    window.location.hash = "";
    window.addEventListener("hashchange", function() {
      this._hashChanged();
    }.bind(this), false);

    this._mode = "edit";

    this._state = init("# Type a grammar here:\n\n");

    this._render();
  }

  dispatch(action) {
    this._state = reducer(this._state, action);
    this._render();
  }

  _render() {
    render(
      <ApplicationComponent
        spec={this._state.spec}
        error={this._state.error}
        grammar={this._state.grammar}
        path={this._state.path}
        mode={this._mode}
        transformStack={this._transformStack}
        transformIndex={this._transformIndex}
        updateSpec={(newValue) => { this.dispatch({ type: "setSpec", spec: newValue }); }}
        edit={() => this.edit()}
        transform={() => this.transform()}
        analyze={() => this.dispatch({ type: "analyze" })}
        undoTransformation={() => { this.undoTransformation(); }}
        redoTransformation={() => { this.redoTransformation(); }}
        applyTransformation={(t) => { this.applyTransformation(t); }}
      />,
      this._element
    );
  }

  _hashChanged() {
    let path = window.location.hash.slice(1);
    if (path == "") {
      path = "/";
    }

    this.dispatch({ type: "setPath", path });
  }

  undoTransformation() {
    if (this._transformIndex > 0) {
      this._transformIndex -= 1;
      this._state.grammar = this._transformStack[this._transformIndex].grammar;
      this._state.spec = this._transformStack[this._transformIndex].grammar.toString();

      this._render();
    }
  }

  redoTransformation() {
    if (this._transformIndex < this._transformStack.length - 1) {
      this._transformIndex += 1;
      this._state.grammar = this._transformStack[this._transformIndex].grammar;
      this._state.spec = this._transformStack[this._transformIndex].grammar.toString();

      this._render();
    }
  }

  applyTransformation(transformation) {
    const item = {
      grammar: this._state.grammar.transform(transformation),
      transformation: transformation
    };

    this._transformIndex += 1;
    this._transformStack.splice(this._transformIndex, this._transformStack.length - this._transformIndex, item);

    this._state.grammar = this._transformStack[this._transformIndex].grammar;
    this._state.spec = this._transformStack[this._transformIndex].grammar.toString();

    this._render();
  }

  transform() {
    const { grammar, error } = parse(this._state.spec);

    this._state.grammar = grammar;
    this._state.error = error;

    if (typeof error === "undefined" && typeof grammar !== "undefined") {
      this._mode = "transform";

      this._transformStack = [{ grammar: grammar }];
      this._transformIndex = 0;
    }

    this._render();
  }

  edit() {
    this._mode = "edit";
    this._render();
  }
}
