const render = require("mithril/render");
const template = require("../templates/nonterminals");

module.exports = class NonterminalsView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      nullable: this._delegate.getCalculation("grammar.nullable"),
      endable: this._delegate.getCalculation("grammar.endable"),
      first: this._delegate.getCalculation("grammar.first"),
      follow: this._delegate.getCalculation("grammar.follow"),
      info: this._delegate.getCalculation("grammar.symbolInfo")
    });

    render(this._element, vnode);
  }
}
