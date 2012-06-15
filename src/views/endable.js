Views["endable"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {
    
    var count = Set.count(params.endable);
    
    if (count > 0)
      this.element.html("<p>" + Helpers.formatSentence(Helpers.formatSymbols(Helpers.listSymbols(params.endable, params.info), params.info)) + " " + (count == 1 ? "is" : "are") + " endable.</p>");
    else
      this.element.html("<p>There are no endable nonterminals.</p>");
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
