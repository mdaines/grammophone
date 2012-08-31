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
  
  var grammar = new Grammar([["A", "B"], ["A", "x"], ["B", "B", "b"], ["B"], ["A", "x", "y"]]);
  
  var diff = [];
  var i;
  
  for (i = 0; i < grammar.productions.length; i++)
    diff.push({ production: grammar.productions[i] });
    
  this._stack = [ { diff: diff, grammar: grammar } ];
  
  //
  
  this._transformView.reload();
  
}

Transform.prototype.getPreviousInfo = function() {
  
  if (this._stack.length > 1)
    return this._stack[this._stack.length - 2].grammar.calculate("grammar.symbolInfo");
  
}

Transform.prototype.getCurrentInfo = function() {
  
  return this._stack[this._stack.length - 1].grammar.calculate("grammar.symbolInfo");
  
}

Transform.prototype.getTransformations = function() {
  
  return this._stack[this._stack.length - 1].grammar.calculate("transformations");
  
}

Transform.prototype.getUndoTransformation = function() {
  
  return this._stack[this._stack.length - 1].undoTransformation;
  
}

Transform.prototype.getDiff = function() {
  
  return this._stack[this._stack.length - 1].diff;
  
}

Transform.prototype.undo = function() {
  
  this._stack.pop();
  this._transformView.reload();
  
}

Transform.prototype.transform = function(transformation) {
  
  var result = this._stack[this._stack.length - 1].grammar.transform(transformation.name, transformation);
  
  this._stack.push({
    diff: result.diff,
    grammar: result.grammar,
    undoTransformation: transformation
  });
  
  this._transformView.reload();
  
}
