//= require templates/transform

var TransformView = function(element) {
  
  this._element = $(element);
  
}

TransformView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

TransformView.prototype.setup = function() {
  
  this._element.on("click", "button", function(e) {
    
    if ($(e.target).data("action") === "undo")
      this._delegate.undo();
    else if ($(e.target).data("action") === "redo")
      this._delegate.redo();
    
  }.bind(this));
  
  this._element.on("change", function(e) {
    
    var index = parseInt(e.target.value);
    this._delegate.transform(this._transformations[index]);
    
  }.bind(this));
  
}

TransformView.prototype.reload = function() {
  
  var productions = this._delegate.getProductions();
  var info = this._delegate.getSymbolInfo();
  
  this._transformations = this._delegate.getTransformations();
  
  var transformations = [];
  var i, j;
  
  for (i = 0; i < productions.length; i++) {
    transformations[i] = [];
    for (j = 0; j < productions[i].length; j++) {
      transformations[i][j] = [];
    }
  }
  
  var transformation;
  
  for (i = 0; i < this._transformations.length; i++) {
    transformation = this._transformations[i];
    transformations[transformation.production][transformation.symbol].push({
      name: transformation.name,
      index: i
    });
  }
  
  this._element.get(0).innerHTML = JST["templates/transform"]({
    productions: productions,
    info: info,
    previousInfo: this._delegate.getPreviousSymbolInfo(),
    transformations: transformations,
    undoTransformation: this._delegate.getUndoTransformation(),
    redoTransformation: this._delegate.getRedoTransformation()
  });
  
}
