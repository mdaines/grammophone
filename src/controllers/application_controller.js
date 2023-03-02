const { render } = require("preact");
const ApplicationComponent = require("../components/application_component.js");
const { reducer, init } = require("../reducer.js");

module.exports = class ApplicationController {
  constructor(element) {
    this._element = element;

    window.location.hash = "";
    window.addEventListener("hashchange", function() {
      this._hashChanged();
    }.bind(this), false);

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
        mode={this._state.mode}
        transformStack={this._state.transformStack}
        transformIndex={this._state.transformIndex}
        updateSpec={(newValue) => { this.dispatch({ type: "setSpec", spec: newValue }); }}
        edit={() => this.dispatch({ type: "edit" })}
        transform={() => this.dispatch({ type: "transform" })}
        analyze={() => this.dispatch({ type: "analyze" })}
        undoTransformation={() => { this.dispatch({ type: "undoTransformation" }); }}
        redoTransformation={() => { this.dispatch({ type: "redoTransformation" }); }}
        applyTransformation={(t) => { this.dispatch({ type: "applyTransformation", transformation: t }); }}
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
}
