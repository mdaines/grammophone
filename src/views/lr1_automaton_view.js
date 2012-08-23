//= require templates/lr_automaton

var LR1AutomatonView = function(element) {
  
  this._element = element;
  
}

LR1AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR1AutomatonView.prototype.reload = function() {
  
  var calculations = {
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lr1_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start"),
    title: "LR(1) Automaton"
  };
  
  this._element.innerHTML = JST["templates/lr_automaton"](calculations);
  this._element.innerHTML += Viz(JST["templates/lr_automaton_graph"](calculations));
  
}
