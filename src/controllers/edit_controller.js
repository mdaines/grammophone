'use strict';

const editTemplate = require('../templates/edit.ejs');

class EditController {

  constructor(element) {
    this._element = element;
    this._element.id = "edit";

    this._element.innerHTML = editTemplate();
  }

  getSpec() {
    return $(this._element).find(".spec").get(0).value;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    $(this._element).find(".spec").get(0).value = this._delegate.getSpec();
  }

}

module.exports = EditController;
