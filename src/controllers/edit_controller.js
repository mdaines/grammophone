var editTemplate = require("../templates/edit.ejs");

module.exports = class EditController {
  constructor(element) {

    this._element = element;
    this._element.id = "edit";

    this._element.innerHTML = editTemplate();

  }

  getSpec() {

    return this._element.querySelector(".spec").value;

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._element.querySelector(".spec").value = this._delegate.getSpec();

  }
}
