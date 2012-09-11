//= require templates/lr_automaton_graph

var LR0AutomatonView = function(element) {
  
  this._element = element;
  
}

LR0AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR0AutomatonView.prototype.reload = function() {
  
  var dot = JST["templates/lr_automaton_graph"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lr0_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start"),
    title: "LR(0) Automaton"
  });
  
  this._element.innerHTML = Viz(dot);
  
}
