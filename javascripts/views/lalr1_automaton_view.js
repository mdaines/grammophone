//= require templates/lr_automaton

var LALR1AutomatonView = function(element) {
  
  this._element = element;
  
}

LALR1AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LALR1AutomatonView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr_automaton"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lalr1_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start")
  });
  
}
