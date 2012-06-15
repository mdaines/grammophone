Views["lr_automaton"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function formatItem(item, params) {
    
    var production;

    if (item.production === -1) {
      
      if (item.index === 0)
        production = "&bull; " + Helpers.formatSymbol(params.start, params.info);
      else
        production = Helpers.formatSymbol(params.start, params.info) + " &bull;";
      
    } else {
      
      var symbols = Helpers.formatSymbols(params.productions[item.production].slice(1), params.info);
      symbols.splice(item.index, 0, "&bull;");
      
      production = Helpers.formatSymbol(params.productions[item.production][0], params.info) + " &rarr; " + symbols.join(" ");
      
    }
    
    if (item.lookaheads)
      return "[" + production + ", " + Helpers.formatSymbols(item.lookaheads, params.info).join(" / ") + "]";
    else if (item.lookahead)
      return "[" + production + ", " + Helpers.formatSymbol(item.lookahead, params.info) + "]";
    else
      return production;
    
  }
  
  function update(params) {
    
    var table = $("<table></table>");
    
    table.append("<tr><th>State</th><th>Items</th><th>Transitions</th></tr>");
    
    params.automaton.forEach(function(state, index) {
      
      var row = $("<tr></tr>");
      
      row.append("<td>" + index + "</td>");
      
      var cell = $("<td></td>");
      var list = $("<ul></ul>");
      
      state.items.forEach(function(item) {
        
        list.append("<li>" + formatItem(item, params) + "</li>");
        
      });
      
      cell.append(list);
      row.append(cell);
      
      cell = $("<td></td>");
      list = $("<ul></ul>");
      
      params.info.order.concat(Grammar.END).forEach(function(symbol) {
        
        if (typeof state.transitions[symbol] !== "undefined")
          list.append("<li>" + Helpers.formatSymbol(symbol, params.info) + " &rArr; " + state.transitions[symbol] + "</li>");
        
      });
      
      cell.append(list);
      row.append(cell);
      
      table.append(row);
      
    });
    
    this.element.html(table);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
