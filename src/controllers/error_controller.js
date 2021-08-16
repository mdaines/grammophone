module.exports = class ErrorController {
  constructor(element) {

    this._element = element;
    this._element.id = "error";

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    var error = this._delegate.getError();

    if (typeof error !== "undefined") {
      this._element.innerHTML = "<code>" + this._delegate.getError() + "</code>";
    } else {
      this._element.innerHTML = "";
    }

  }
}
