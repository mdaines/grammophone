const m = require("mithril");
const template = require("../templates/sentences");

module.exports = class SentencesView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      sentences: this._delegate.getCalculation("grammar.sentences"),
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      more: false
    });

    m.render(this._element, vnode);
  }
}
