const m = require("mithril");
const template = require("../templates/header");

module.exports = class HeaderView {
  constructor(element) {
    this._element = element;
    this._element.className = "header";
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      path: this._delegate.getPathComponents()
    });

    m.render(this._element, vnode);
  }
}
