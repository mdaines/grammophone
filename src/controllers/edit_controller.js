const render = require("mithril/render");
const template = require("../templates/edit");

module.exports = class EditController {
  constructor(element) {
    this._element = element;
    this._element.id = "edit";
  }

  getSpec() {
    return this._element.querySelector(".spec").value;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      spec: this._delegate.getSpec()
    });

    render(this._element, vnode);
  }
}
