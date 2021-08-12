const m = require("mithril");
const template = require("../templates/lr1_table");

module.exports = class LALR1TableView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let vnode = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      table: this._delegate.getCalculation("parsing.lr.lalr1_table"),
      productions: this._delegate.getCalculation("grammar.productions")
    });

    m.render(this._element, vnode);
  }
}
