Views["productions"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {
    
    var table = $("<table></table>");
    
    params.productions.forEach(function(production, index) {
      
      var head = production[0];
      var body = production.slice(1);
      
      var row = $("<tr></tr>");
      row.append("<td>" + index + "</td>");
      row.append("<td>" + Helpers.formatSymbol(head, params.info) + "</td>");
      row.append("<td>&rarr;</td>");
      row.append("<td>" + Helpers.formatSymbols(body, params.info).join(" ") + "</td>");
      
      table.append(row);
      
    });
    
    $(this.element).html(table);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
