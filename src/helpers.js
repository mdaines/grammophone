var Helpers = function() {
  
  // class
  
  function listSymbols(set, order) {
    
    var i;
    var result = [];
    
    for (i = 0; i < order.length; i++) {
      if (set[order[i]])
        result.push(order[i]);
    }
    
    if (set[Grammar.END])
      result.push(Grammar.END);
    
    return result;
    
  }
  
  function prettifySymbol(symbol) {
    
    return symbol.replace(/'/g, "&prime;");
    
  }
  
  function formatSymbol(symbol, info) {
    
    if (symbol == Grammar.END)
      return "<u>$</u>";
    else if (info.nonterminals[symbol])
      return "<i>" + prettifySymbol(escapeHTML(symbol)) + "</i>";
    else if (info.terminals[symbol])
      return "<b>" + prettifySymbol(escapeHTML(symbol)) + "</b>";
    else
      throw "Unknown symbol: " + symbol;
    
  }
  
  function formatSymbols(symbols, info) {
    
    var i;
    var result = [];
    
    for (i = 0; i < symbols.length; i++)
      result[i] = formatSymbol(symbols[i], info);
    
    return result;
    
  }
  
  function formatProduction(production, info) {
    
    var result = "";
    var i;
    
    result += formatSymbol(production[0], info);
    result += " &rarr; ";
    
    if (production.length > 1)
      result += formatSymbols(production.slice(1), info).join(" ");
    else
      result += "<u>&epsilon;</u>";
    
    return result;
    
  }
  
  function formatSentence(strings) {
    
    if (strings.length == 0)
      return "";
    else if (strings.length == 1)
      return strings[0];
    else if (strings.length == 2)
      return strings.join(" and ");
    else
      return strings.slice(0, -1).concat("and " + strings[strings.length-1]).join(", ");
    
  }
  
  function repeatString(string, times) {
    
    var result = "";
    var i;
    
    for (i = 0; i < times; i++)
      result += string;
      
    return result;
    
  }
  
  // From Prototype
  
  function escapeHTML(string) {
    
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
  }
  
  // application delegate
  
  function setDelegate(delegate) {
    
    this._delegate = delegate;
    
  }
  
  function buildHref(path, fragment) {
    
    return this._delegate.buildHref(path, fragment);
    
  }
  
  // export
  
  var klass = {};
  
  klass.listSymbols = listSymbols;
  klass.formatSymbol = formatSymbol;
  klass.formatSymbols = formatSymbols;
  klass.formatProduction = formatProduction;
  klass.formatSentence = formatSentence;
  klass.repeatString = repeatString;
  klass.escapeHTML = escapeHTML;
  klass.setDelegate = setDelegate;
  klass.buildHref = buildHref;
  
  return klass;
  
}();
