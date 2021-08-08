var template = require('../templates/blank_slate.ejs');

module.exports = class BlankSlateView {
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
