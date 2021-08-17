const render = require("mithril/render");
const template = require("../templates/blank_slate");

module.exports = class BlankSlateView {
  constructor(element) {
    this._element = element;
    this._element.className = "blank-slate";
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({});

    render(this._element, vnode);
  }
}
