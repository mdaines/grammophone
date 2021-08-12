const m = require("mithril");
const template = require("../templates/parsing");

module.exports = class ParsingView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      classification: this._delegate.getCalculation("grammar.classification")
    });

    m.render(this._element, vnode);
  }
}
