'use strict';

class ErrorController {
  
  constructor(element) {
    this._element = element;
    this._element.id = "error";
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let error = this._delegate.getError();
  
    if (typeof error !== "undefined") {
      this._element.innerHTML = "<pre>" + this._delegate.getError() + "</pre>";
    } else {
      this._element.innerHTML = "";
    }
  }
  
}

module.exports = ErrorController;
