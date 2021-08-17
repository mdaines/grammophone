const render = require("mithril/render");
const template = require("../templates/sentences");

module.exports = class ShortSentencesView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      sentences: this._delegate.getCalculation("grammar.sentences").slice(0, 10),
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      more: this._delegate.getCalculation("grammar.sentences").length > 10
    });

    render(this._element, vnode);
  }
}
