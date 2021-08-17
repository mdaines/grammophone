const render = require("mithril/render");
const template = require("../templates/lr0_table");

module.exports = class LR0TableView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      table: this._delegate.getCalculation("parsing.lr.lr0_table"),
      productions: this._delegate.getCalculation("grammar.productions")
    });

    render(this._element, vnode);
  }
}
