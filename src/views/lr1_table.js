Views["lr1_table"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {
    
    var colgroups = "<colgroup><col></colgroup>";
    
    colgroups += "<colgroup class=\"t\">" + Helpers.repeatString("<col>", Set.count(params.info.terminals) + 1) + "</colgroup>";
    
    if (Set.count(params.info.nonterminals) > 0)
      colgroups += "<colgroup class=\"nt\">" + Helpers.repeatString("<col>", Set.count(params.info.nonterminals)) + "</colgroup>";
      
      
    var table = $("<table class=\"lr\">" + colgroups + "</table>");
    
    // Header row, with terminals and $
    
    var row = $("<tr><th>State</th></tr>");
    
    params.info.order.forEach(function(symbol) {
      if (params.info.terminals[symbol])
        row.append("<th>" + Helpers.formatSymbol(symbol, params.info) + "</th>");
    });
    
    row.append("<th>" + Helpers.formatSymbol(Grammar.END, params.info) + "</th>");
    
    params.info.order.forEach(function(symbol) {
      if (params.info.nonterminals[symbol])
        row.append("<th>" + Helpers.formatSymbol(symbol, params.info) + "</th>");
    });
    
    table.append(row);
    
    params.table.forEach(function(state, index) {
      
      var row = $("<tr><td>" + index + "</td></tr>");
      
      params.info.order.concat(Grammar.END).forEach(function(s) {
        
        if (params.info.terminals[s] || s == Grammar.END) {
        
          var cell = $("<td></td>");
          var list = $("<ul></ul>");
          
          if (state[s] && typeof state[s].shift !== "undefined")
            list.append("<li>shift(" + state[s].shift + ")</li>");
            
          if (state[s] && state[s].reduce) {
          
            state[s].reduce.forEach(function(p) {
              if (p === -1)
                list.append("<li>accept</li>");
              else
                list.append("<li>reduce(" + Helpers.formatProduction(params.productions[p], params.info) + ")</li>");
            });
          
            if (state[s] && typeof state[s].shift !== "undefined" && state[s].reduce.length > 0)
              cell.addClass("conflict");
            else if (state[s].reduce.length > 1)
              cell.addClass("conflict");
              
          }
        
          cell.append(list);
          row.append(cell);
          
        }
        
      });
        
      params.info.order.forEach(function(s) {
        
        if (params.info.nonterminals[s]) {
      
          var cell = $("<td></td>");
          var list = $("<ul></ul>");
          
          if (state[s] && typeof state[s].shift !== "undefined")
            list.append("<li>" + state[s].shift + "</li>");
            
          cell.append(list);
          row.append(cell);
          
        }
        
      });
      
      table.append(row);
      
    });
    
    this.element.html(table);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
