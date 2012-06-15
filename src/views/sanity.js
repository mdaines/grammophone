Views["sanity"] = (function() {
  
  function initialize() {
    this.element = $("<article></article>");
  }
  
  function update(params) {
    
    var list = $("<ul></ul>");
    
    if (Set.any(params.unreachable))
      list.append("<li>The grammar has unreachable nonterminals: " + Helpers.formatSentence(Helpers.formatSymbols(Helpers.listSymbols(params.unreachable, params.info), params.info)) + ".</li>");
    else
      list.append("<li>All nonterminals are reachable.</li>");
    
    if (Set.any(params.unrealizable))
      list.append("<li>The grammar has unrealizable nonterminals: " + Helpers.formatSentence(Helpers.formatSymbols(Helpers.listSymbols(params.unrealizable, params.info), params.info)) + ".</li>");
    else
      list.append("<li>All nonterminals are realizable.</li>");

    if (typeof params.cycle !== "undefined")
      list.append("<li>The grammar is cyclic: " + Helpers.formatSymbols(params.cycle, params.info).join(" &rArr; ") + " is a cycle.</li>");
    else
      list.append("<li>The grammar contains no cycles.</li>");
    
    this.element.append(list);
    
  }
  
  var klass = initialize;
  klass.prototype.update = update;
  
  return klass;
  
})();
