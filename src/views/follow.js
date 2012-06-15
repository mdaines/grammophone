Views["follow"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {

    var table = $("<table class=\"follow\"></table>");
    
    params.info.order.forEach(function(symbol) {
      
      if (params.info.nonterminals[symbol]) {
      
        if (!params.follow[symbol] || !Set.any(params.follow[symbol]))
          table.append("<tr><td>Follow(" + Helpers.formatSymbol(symbol, params.info) + ")</td><td>=</td><td>&empty;</td></tr>");
        else
          table.append("<tr><td>Follow(" + Helpers.formatSymbol(symbol, params.info) + ")</td><td>=</td><td>{ " + Helpers.formatSymbols(Helpers.listSymbols(params.follow[symbol], params.info), params.info).join(", ") + " }</td></tr>");
          
      }
      
    });
    
    $(this.element).html(table);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
