const m = require("mithril");
const template = require("../templates/mode");

module.exports = class ModeController {
  constructor(element) {
    this._element = element;
    this._element.id = "mode";

    this._element.addEventListener("change", function(e) {
      if (e.target.value === "edit") {
        this._delegate.edit();
      } else if (e.target.value === "transform") {
        this._delegate.transform();
      }
    }.bind(this));

    this._element.addEventListener("click", function(e) {
      if (e.target.id === "mode-analyze") {
        this._delegate.analyze();
      }
    }.bind(this));
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      mode: this._delegate.getMode()
    });

    m.render(this._element, vnode);
  }
}
