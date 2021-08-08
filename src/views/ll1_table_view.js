var template = require('../templates/ll1_table.ejs');
var Helpers = require('../helpers');
var Sets = require('../sets');
var END = require("../grammar/symbols").END;

module.exports = class LL1TableView {
  constructor(element) {

    this._element = element;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._element.innerHTML = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      table: this._delegate.getCalculation("parsing.ll.ll1_table"),
      productions: this._delegate.getCalculation("grammar.productions"),
      Helpers: Helpers,
      Sets: Sets,
      END: END
    });

  }

}
