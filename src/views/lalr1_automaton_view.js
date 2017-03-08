//= require templates/lr_automaton_graph

const template = require('../templates/lr_automaton_graph.ejs');

var LALR1AutomatonView = function(element) {
  
  this._element = element;
  
}

LALR1AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LALR1AutomatonView.prototype.reload = function() {
  
  var dot = template({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lalr1_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start"),
    title: "LALR(1) Automaton"
  });
  
  this._element.innerHTML = Viz(dot);
  
}

module.exports = LALR1AutomatonView;
