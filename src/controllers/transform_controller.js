var TransformView = require('../views/transform_view');

module.exports = class TransformController {
  constructor(element) {

    this._element = element;
    this._element.id = "transform";

    this._transformElement = document.createElement("article");
    this._element.appendChild(this._transformElement);

    this._transformView = new TransformView(this._transformElement);
    this._transformView.setDelegate(this);

    if (this._transformView.setup) {
      this._transformView.setup();
    }

  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    this._index = 0;
    this._stack = [ { grammar: this._delegate.getGrammar() } ];

    this._transformView.reload();

  }

  getProductions() {

    return this._stack[this._index].grammar.productions;

  }

  getSymbolInfo() {

    return this._stack[this._index].grammar.calculate("grammar.symbolInfo");

  }

  getPreviousSymbolInfo() {

    if (this._index > 0) {
      return this._stack[this._index - 1].grammar.calculate("grammar.symbolInfo");
    }

  }

  getTransformations(productionIndex, symbolIndex) {

    return this._stack[this._index].grammar.calculate("transformations.all");

  }

  getUndoTransformation() {

    if (this._index > 0) {
      return this._stack[this._index].transformation;
    }

  }

  getRedoTransformation() {

    if (this._index < this._stack.length - 1) {
      return this._stack[this._index + 1].transformation;
    }

  }

  undo() {

    if (this._index > 0) {
      this._index--;
    }

    this._transformView.reload();

    this._delegate.grammarChanged(this._stack[this._index].grammar);

  }

  redo() {

    if (this._index < this._stack.length - 1) {
      this._index++;
    }

    this._transformView.reload();

    this._delegate.grammarChanged(this._stack[this._index].grammar);

  }

  transform(transformation) {

    var item = {
      grammar: this._stack[this._index].grammar.transform(transformation),
      transformation: transformation
    };

    this._index++;
    this._stack.splice(this._index, this._stack.length - this._index, item);

    this._transformView.reload();

    this._delegate.grammarChanged(this._stack[this._index].grammar);

  }
}
