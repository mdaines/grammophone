Views["first"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {
    
    var table = $("<table class=\"first\"></table>");
    
    params.info.order.forEach(function(symbol) {
      
      if (params.info.nonterminals[symbol]) {
      
        if (!params.first[symbol] || !Set.any(params.first[symbol]))
          table.append("<tr><td>First(" + Helpers.formatSymbol(symbol, params.info) + ")</td><td>=</td><td>&empty;</td></tr>");
        else
          table.append("<tr><td>First(" + Helpers.formatSymbol(symbol, params.info) + ")</td><td>=</td><td>{ " + Helpers.formatSymbols(Helpers.listSymbols(params.first[symbol], params.info), params.info).join(", ") + " }</td></tr>");
          
      }
      
    });
    
    $(this.element).html(table);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
