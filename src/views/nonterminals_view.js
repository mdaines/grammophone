//= require templates/nonterminals

const template = require('../templates/nonterminals.ejs');
const Helpers = require('../helpers');

var NonterminalsView = function(element) {
  
  this._element = element;
  
}

NonterminalsView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

NonterminalsView.prototype.reload = function() {
  
  this._element.innerHTML = template({
    nullable: this._delegate.getCalculation("grammar.nullable"),
    endable: this._delegate.getCalculation("grammar.endable"),
    first: this._delegate.getCalculation("grammar.first"),
    follow: this._delegate.getCalculation("grammar.follow"),
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    Helpers
  });
  
}

module.exports = NonterminalsView;
