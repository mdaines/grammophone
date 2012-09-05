//= require views/transform_view

var TransformController = function(element) {
  
  this._element = element;
  this._element.id = "transform";
  
  this._transformElement = document.createElement("article");
  this._element.appendChild(this._transformElement);
  
  this._transformView = new TransformView(this._transformElement);
  this._transformView.setDelegate(this);
  
  if (this._transformView.setup)
    this._transformView.setup();
    
  //
  
  var grammar = Grammar.parse("EXPR -> EXPR mult EXPR | TERM . TERM -> TERM add TERM | FACTOR . FACTOR -> num | lpar EXPR rpar | star EXPR .").grammar;
  
  this._index = 0;
  this._stack = [ { grammar: grammar } ];
  
  //
  
  this._transformView.reload();
  
}

TransformController.prototype.getProductions = function() {
  
  return this._stack[this._index].grammar.productions;
  
}

TransformController.prototype.getSymbolInfo = function() {
  
  return this._stack[this._index].grammar.calculate("grammar.symbolInfo");
  
}

TransformController.prototype.getTransformations = function(productionIndex, symbolIndex) {
  
  return this._stack[this._index].grammar.calculate("transformations");
  
}

TransformController.prototype.undo = function() {
  
  if (this._index > 0)
    this._index--;
  
  this._transformView.reload();
  
}

TransformController.prototype.redo = function() {
  
  if (this._index < this._stack.length - 1)
    this._index++;
  
  this._transformView.reload();
  
}

TransformController.prototype.transform = function(transformation) {
  
  var item = {
    grammar: this._stack[this._index].grammar.transform(transformation),
    transformation: transformation
  };
  
  this._index++;
  this._stack.splice(this._index, this._stack.length - this._index, item);
  
  this._transformView.reload();
  
}
