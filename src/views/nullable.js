Views["nullable"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {

    var count = Set.count(params.nullable);
    
    if (count > 0)
      this.element.html("<p>" + Helpers.formatSentence(Helpers.formatSymbols(Helpers.listSymbols(params.nullable, params.info), params.info)) + " " + (count == 1 ? "is" : "are") + " nullable.</p>");
    else
      this.element.html("<p>There are no nullable nonterminals.</p>");
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
