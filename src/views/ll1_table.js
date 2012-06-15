Views["ll1_table"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {

    var table = $("<table class=\"ll1\"><colgroup><col></colgroup><colgroup class=\"t\">" + Helpers.repeatString("<col>", Set.count(params.info.terminals) + 1) + "</colgroup></table>");
    
    // Header row, with terminals and $
    
    var row = $("<tr><th></th></tr>");
    
    params.info.order.forEach(function(symbol) {
      
      if (params.info.terminals[symbol])
        row.append("<th>" + Helpers.formatSymbol(symbol, params.info) + "</th>");
        
    });
    
    row.append("<th>" + Helpers.formatSymbol(Grammar.END, params.info) + "</th>");
    
    table.append(row);
    
    // Nonterminal rows
    
    params.info.order.forEach(function(nt) {
    
      if (params.info.nonterminals[nt]) {
        
        var row = $("<tr><th scope=\"row\">" + Helpers.formatSymbol(nt, params.info) + "</th></tr>");
        
        params.info.order.concat(Grammar.END).forEach(function(t) {
          
          if (params.info.terminals[t] || t === Grammar.END) {
            
            if (params.table[nt][t]) {
            
              var cell = $("<td></td>");
              var list = $("<ul></ul>");
            
              params.table[nt][t].forEach(function(p) {
                list.append("<li>" + Helpers.formatProduction(params.productions[p], params.info) + "</li>");
              });
              
              if (params.table[nt][t].length > 1)
                cell.addClass("conflict");
            
              cell.append(list)
              row.append(cell);
            
            } else {
            
              row.append("<td></td>");
            
            }
            
          }
          
        });
        
        table.append(row);
        
      }
    
    });
    
    $(this.element).html(table);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
