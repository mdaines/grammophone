var template = require("../templates/lr1_table.ejs");
var Helpers = require('../helpers');
var Sets = require('../sets');
var END = require("../grammar/symbols").END;

module.exports = class SLR1TableView {
  constructor(element) {

    this._element = element;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._element.innerHTML = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      table: this._delegate.getCalculation("parsing.lr.slr1_table"),
      productions: this._delegate.getCalculation("grammar.productions"),
      Helpers: Helpers,
      Sets: Sets,
      END: END
    });

  }

}
