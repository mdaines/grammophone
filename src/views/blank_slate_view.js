'use strict';

const template = require('../templates/blank_slate.ejs');

class BlankSlateView {

  constructor(element) {
    this._element = element;
    this._element.className = "blank-slate";
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    this._element.innerHTML = template({});
  }
}

module.exports = BlankSlateView;
