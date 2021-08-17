const render = require("mithril/render");
const template = require("../templates/transform");

module.exports = class TransformView {
  constructor(element) {
    this._element = element;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  setup() {
    this._element.addEventListener("click", function(e) {
      if (e.target.dataset.action === "undo") {
        this._delegate.undo();
      } else if (e.target.dataset.action === "redo") {
        this._delegate.redo();
      }
    }.bind(this));

    this._element.addEventListener("change", function(e) {
      let index = parseInt(e.target.value);
      this._delegate.transform(this._transformations[index]);
    }.bind(this));
  }

  reload() {
    this._transformations = this._delegate.getTransformations();

    let vnode = template({
      productions: this._delegate.getProductions(),
      info: this._delegate.getSymbolInfo(),
      undoTransformation: this._delegate.getUndoTransformation(),
      redoTransformation: this._delegate.getRedoTransformation(),
      transformations: this._transformations
    });

    render(this._element, vnode);
  }

}
