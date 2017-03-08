const END = require('./grammar/symbols').END;

var Helpers = function() {
  
  // class
  
  function listSymbols(set, order) {
    
    var i;
    var result = [];
    
    for (i = 0; i < order.length; i++) {
      if (set[order[i]])
        result.push(order[i]);
    }
    
    if (set[END])
      result.push(END);
    
    return result;
    
  }
  
  function prettifySymbol(symbol) {
    
    return symbol.replace(/'/g, "&prime;");
    
  }
  
  function formatSymbol(symbol, info) {
    
    if (symbol == END)
      return "<u>$</u>";
    else if (info.nonterminals[symbol])
      return "<i>" + prettifySymbol(escapeHTML(symbol)) + "</i>";
    else if (info.terminals[symbol])
      return "<b>" + prettifySymbol(escapeHTML(symbol)) + "</b>";
    else
      throw "Unknown symbol: " + symbol;
    
  }
  
  function bareFormatSymbol(symbol, info) {
    
    if (symbol == END)
      return "$";
    else if (info.nonterminals[symbol] || info.terminals[symbol])
      return prettifySymbol(escapeHTML(symbol));
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
  
  function bareFormatSymbols(symbols, info) {
    
    var i;
    var result = [];
    
    for (i = 0; i < symbols.length; i++)
      result[i] = bareFormatSymbol(symbols[i], info);
    
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
  
  function formatItem(item, start, productions, info) {
    
    var production;

    if (item.production === -1) {
      
      if (item.index === 0)
        production = "&bull; " + Helpers.formatSymbol(start, info);
      else
        production = Helpers.formatSymbol(start, info) + " &bull;";
      
    } else {
      
      var symbols = Helpers.formatSymbols(productions[item.production].slice(1), info);
      symbols.splice(item.index, 0, "&bull;");
      
      production = Helpers.formatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
      
    }
    
    if (item.lookaheads)
      return "[" + production + ", " + Helpers.formatSymbols(item.lookaheads, info).join(" / ") + "]";
    else if (item.lookahead)
      return "[" + production + ", " + Helpers.formatSymbol(item.lookahead, info) + "]";
    else
      return production;
    
  }
  
  function bareFormatItem(item, start, productions, info) {
    
    var production;

    if (item.production === -1) {
      
      if (item.index === 0)
        production = "&bull; " + Helpers.bareFormatSymbol(start, info);
      else
        production = Helpers.bareFormatSymbol(start, info) + " &bull;";
      
    } else {
      
      var symbols = Helpers.bareFormatSymbols(productions[item.production].slice(1), info);
      symbols.splice(item.index, 0, "&bull;");
      
      production = Helpers.bareFormatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
      
    }
    
    if (item.lookaheads)
      return "[" + production + ", " + Helpers.bareFormatSymbols(item.lookaheads, info).join(" / ") + "]";
    else if (item.lookahead)
      return "[" + production + ", " + Helpers.bareFormatSymbol(item.lookahead, info) + "]";
    else
      return production;
    
  }
  
  var TRANSFORMATION_FORMATTERS = {
    expand: function(transformation, productions, info) {
      return "Expand Nonterminal";
    },
    
    removeImmediateLeftRecursion: function(transformation, productions, info) {
      return "Remove Immediate Left Recursion";
        
    },
    
    leftFactor: function(transformation, productions, info) {
      return "Left Factor " +
        bareFormatSymbols(productions[transformation.production].slice(1, transformation.length + 1), info).join(" ");
    },
    
    epsilonSeparate: function(transformation, productions, info) {
      return "Epsilon-Separate";
    },
    
    removeUnreachable: function(transformation, productions, info) {
      return "Remove Unreachable Nonterminal"
    }
  }
  
  function formatTransformation(transformation, productions, info) {
    
    return TRANSFORMATION_FORMATTERS[transformation.name](transformation, productions, info) || transformation.name;
    
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
    
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
    
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
  klass.bareFormatSymbol = bareFormatSymbol;
  klass.formatSymbols = formatSymbols;
  klass.bareFormatSymbols = bareFormatSymbols;
  klass.formatProduction = formatProduction;
  klass.formatSentence = formatSentence;
  klass.formatItem = formatItem;
  klass.bareFormatItem = bareFormatItem;
  klass.formatTransformation = formatTransformation;
  klass.repeatString = repeatString;
  klass.escapeHTML = escapeHTML;
  klass.setDelegate = setDelegate;
  klass.buildHref = buildHref;
  
  return klass;
  
}();

module.exports = Helpers;
