var template = require('../templates/header.ejs');
var Helpers = require('../helpers');

module.exports = class HeaderView {
  constructor(element) {

    this._element = element;
    this._element.className = "header";

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    var path = this._delegate.getPathComponents();

    this._element.innerHTML = template({ path: path, Helpers: Helpers });

  }

}
