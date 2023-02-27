const { render } = require("preact");
const BlankSlate = require("../templates/blank_slate.js");

module.exports = class BlankSlateView {
  constructor(element) {
    this._element = element;
    this._element.className = "blank-slate";
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    render(<BlankSlate />, this._element);
  }
}
