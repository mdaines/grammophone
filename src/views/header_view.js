'use strict';

const template = require('../templates/header.ejs');
const Helpers = require('../helpers');

class HeaderView {

  constructor(element) {
    this._element = element;
    this._element.className = "header";
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let path = this._delegate.getPathComponents();

    this._element.innerHTML = template({ path: path, Helpers });
  }

}

module.exports = HeaderView;
