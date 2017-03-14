'use strict';

const template = require('../templates/transform.ejs');
const Helpers = require('../helpers');

class TransformView {
  
  constructor(element) {
    this._element = $(element);
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  setup() {
    this._element.on("click", "button", (e) => {
      if ($(e.target).data("action") === "undo") {
        this._delegate.undo();
      } else if ($(e.target).data("action") === "redo") {
        this._delegate.redo();
      }
    });
  
    this._element.on("change", (e) => {
      let index = parseInt(e.target.value);
      this._delegate.transform(this._transformations[index]);
    });
  }

  reload() {
    let productions = this._delegate.getProductions();
    let info = this._delegate.getSymbolInfo();
  
    this._transformations = this._delegate.getTransformations();
  
    let transformations = [];
  
    for (let i = 0; i < productions.length; i++) {
      transformations[i] = [];
      for (let j = 0; j < productions[i].length; j++) {
        transformations[i][j] = [];
      }
    }
  
    let transformation;
  
    for (let i = 0; i < this._transformations.length; i++) {
      transformation = this._transformations[i];
      transformations[transformation.production][transformation.symbol].push({
        index: i,
        transformation: transformation
      });
    }
  
    this._element.get(0).innerHTML = template({
      productions: productions,
      info: info,
      previousInfo: this._delegate.getPreviousSymbolInfo(),
      transformations: transformations,
      undoTransformation: this._delegate.getUndoTransformation(),
      redoTransformation: this._delegate.getRedoTransformation(),
      Helpers
    });
  }
  
}

module.exports = TransformView;
