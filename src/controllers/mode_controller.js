'use strict';

const modeTemplate = require('../templates/mode.ejs');

class ModeController {

  constructor(element) {
    this._element = element;
    this._element.id = "mode";

    this._element.innerHTML = modeTemplate();

    $(this._element).find("#mode-edit").on("change", (e) => {
      if (e.target.checked) {
        this._delegate.edit();
      }
    });

    $(this._element).find("#mode-transform").on("change", (e) => {
      if (e.target.checked) {
        this._delegate.transform();
      }
    });

    $(this._element).find("#mode-analyze").on("click", () => {
      this._delegate.analyze();
    });
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let mode = this._delegate.getMode();

    if (mode === "edit") {
      $(this._element).find("#mode-edit").get(0).checked = true;
      $(this._element).find("#mode-analyze").get(0).disabled = false;
    } else {
      $(this._element).find("#mode-transform").get(0).checked = true;
      $(this._element).find("#mode-analyze").get(0).disabled = true;
    }
  }

}

module.exports = ModeController;
