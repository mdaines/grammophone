var modeTemplate = require('../templates/mode.ejs');

module.exports = class ModeController {
  constructor(element) {

    this._element = element;
    this._element.id = "mode";

    this._element.innerHTML = modeTemplate();

    this._element.querySelector("#mode-edit").addEventListener("change", function(e) {
      if (e.target.checked) {
        this._delegate.edit();
      }
    }.bind(this));

    this._element.querySelector("#mode-transform").addEventListener("change", function(e) {
      if (e.target.checked) {
        this._delegate.transform();
      }
    }.bind(this));

    this._element.querySelector("#mode-analyze").addEventListener("click", function(e) {
      this._delegate.analyze();
    }.bind(this));

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    var mode = this._delegate.getMode();

    if (mode === "edit") {

      this._element.querySelector("#mode-edit").checked = true;
      this._element.querySelector("#mode-analyze").disabled = false;

    } else {

      this._element.querySelector("#mode-transform").checked = true;
      this._element.querySelector("#mode-analyze").disabled = true;

    }

  }
}
