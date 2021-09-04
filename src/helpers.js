const m = require("mithril/hyperscript");
const END = require("./grammar/symbols").END;

const ARROW = "\u2192";
const EPSILON = "\u03B5";

function fillArray(count, value) {
  let array = [];
  for (let i = 0; i < count; i++) {
    array.push(value);
  }
  return array;
}

function listSymbols(set, order) {
  let result = [];

  for (let i = 0; i < order.length; i++) {
    if (set.has(order[i])) {
      result.push(order[i]);
    }
  }

  if (set.has(END)) {
    result.push(END);
  }

  return result;
}

function formatSymbolList(symbols, info, separator) {
  if (typeof separator === "undefined") {
    separator = ", ";
  }

  let result = [];

  for (let i = 0; i < symbols.length; i++) {
    if (i > 0) {
      result.push(separator);
    }
    result.push(formatSymbol(symbols[i], info));
  }

  return result;
}

function prettifySymbol(symbol) {
  return symbol;
}

function formatSymbol(symbol, info) {
  if (symbol == END) {
    return m("u", "$");
  } else if (info.nonterminals.has(symbol)) {
    return m("i", prettifySymbol(symbol));
  } else if (info.terminals.has(symbol)) {
    return m("b", prettifySymbol(symbol));
  } else {
    throw new Error("Unknown symbol: " + symbol);
  }
}

function formatProduction(production, info) {
  let result = [];

  result.push(formatSymbol(production[0], info));
  result.push(" ");
  result.push(ARROW);
  result.push(" ");

  if (production.length > 1) {
    production.slice(1).forEach(function(symbol, index) {
      if (index > 0) {
        result.push(" ");
      }
      result.push(formatSymbol(symbol, info));
    });
  } else {
    result.push(m("u", EPSILON));
  }

  return result;
}

function formatSentence(sentence, info) {
  let result = [];

  if (sentence.length === 0) {
    result.push(m("u", EPSILON));
  } else {
    sentence.forEach(function(symbol, index) {
      if (index > 0) {
        result.push(" ");
      }
      result.push(formatSymbol(symbol, info));
    });
  }

  return result;
}

const ESCAPE = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;"
};

function escapeChar(char) {
  return ESCAPE[char];
}

function escapeString(string) {
  return string.replace(/[&<>"]/g, escapeChar);
}

function barePrettifySymbol(symbol) {
  return symbol.replace(/'/g, "&prime;");
}

function bareFormatSymbol(symbol, info) {
  if (symbol == END) {
    return "$";
  } else if (info.nonterminals.has(symbol) || info.terminals.has(symbol)) {
    return barePrettifySymbol(escapeString(symbol));
  } else {
    throw new Error("Unknown symbol: " + symbol);
  }
}

function bareFormatSymbols(symbols, info) {
  let result = [];

  for (let i = 0; i < symbols.length; i++) {
    result.push(bareFormatSymbol(symbols[i], info));
  }

  return result;
}

function bareFormatItem(item, start, productions, info) {
  let production;

  if (item.production === -1) {
    if (item.index === 0) {
      production = "&bull; " + bareFormatSymbol(start, info);
    } else {
      production = bareFormatSymbol(start, info) + " &bull;";
    }
  } else {
    let symbols = bareFormatSymbols(productions[item.production].slice(1), info);
    symbols.splice(item.index, 0, "&bull;");

    production = bareFormatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
  }

  if (item.lookaheads) {
    return "[" + production + ", " + bareFormatSymbols(item.lookaheads, info).join(" / ") + "]";
  } else if (item.lookahead) {
    return "[" + production + ", " + bareFormatSymbol(item.lookahead, info) + "]";
  } else {
    return production;
  }
}

const TRANSFORMATION_FORMATTERS = {
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

module.exports.fillArray = fillArray;
module.exports.listSymbols = listSymbols;
module.exports.formatSymbolList = formatSymbolList;
module.exports.formatSymbol = formatSymbol;
module.exports.formatProduction = formatProduction;
module.exports.formatSentence = formatSentence;
module.exports.escapeString = escapeString;
module.exports.bareFormatSymbol = bareFormatSymbol;
module.exports.bareFormatSymbols = bareFormatSymbols;
module.exports.bareFormatItem = bareFormatItem;
module.exports.formatTransformation = formatTransformation;
