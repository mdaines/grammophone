//= require views/transform_view

var Transform = function(element) {
  
  this._element = element;
  this._element.id = "transform";
  
  this._transformElement = document.createElement("article");
  this._element.appendChild(this._transformElement);
  
  this._transformView = new TransformView(this._transformElement);
  this._transformView.setDelegate(this);
  
  if (this._transformView.setup)
    this._transformView.setup();
    
  //
  
  this._grammar = new Grammar([["A", "B"], ["A", "x"], ["B", "B", "b"], ["B"], ["A", "x", "y"]]);
  this._stack = [ { grammar: this._grammar } ];
  
  //
  
  this._transformView.reload();
  
}

Transform.prototype.getProductions = function() {
  
  return this._grammar.productions;
  
}

Transform.prototype.getSymbolInfo = function() {
  
  console.log(this._grammar);
  
  return this._grammar.calculate("grammar.symbolInfo");
  
}

Transform.prototype.getTransformations = function(productionIndex, symbolIndex) {
  
  return this._grammar.calculate("transformations");
  
}

Transform.prototype.undo = function() {
  
  if (this._stack.length > 1) {
    this._stack.pop();
    this._grammar = this._stack[this._stack.length - 1].grammar;
  }
  
  this._transformView.reload();
  
}

Transform.prototype.transform = function(transformation) {
  
  this._grammar = this._grammar.transform(transformation);
  
  this._stack.push({
    transformation: transformation,
    grammar: this._grammar
  });
  
  this._transformView.reload();
  
}
