import { END } from "../grammar/symbols.js";
import { createElement as h, Fragment } from "react";

const ARROW = "→";

const EPSILON = "ε";

const NONPRINTING_PATTERN = /(\s|\x08|\0)/; // eslint-disable-line no-control-regex

const NONPRINTING = {
  "\0": "\\0",
  "\n": "\\n",
  "\r": "\\r",
  "\v": "\\v",
  "\t": "\\t",
  "\b": "\\b",
  "\f": "\\f"
};

const BARE_NONPRINTING = {
  "\0": "\\\\0",
  "\n": "\\\\n",
  "\r": "\\\\r",
  "\v": "\\\\v",
  "\t": "\\\\t",
  "\b": "\\\\b",
  "\f": "\\\\f"
};

const SPACE = "␣";

const ESCAPE = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};

export function fillArray(count, fn) {
  let array = [];
  for (let i = 0; i < count; i++) {
    array.push(fn(i));
  }
  return array;
}

export function listSymbols(set, order) {
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

export function formatSymbolList(symbols, info, separator) {
  if (typeof separator === "undefined") {
    separator = ", ";
  }

  return symbols.map((symbol, index) => {
    if (index > 0) {
      return h(Fragment, { key: index }, separator, formatSymbol(symbol, info));
    } else {
      return h(Fragment, { key: index }, formatSymbol(symbol, info));
    }
  });
}

/**
 * Format symbol list with custom renderer for i18n Trans component
 * @param {Array} symbols - List of symbols to format
 * @param {Object} info - Symbol information
 * @param {string|Function} separator - Separator string or render function
 * @param {Function} renderSymbol - Custom render function for each symbol (default: formatSymbol)
 * @returns {Array} Formatted symbol list as React elements
 */
export function formatSymbolListWithRenderer(
  symbols,
  info,
  separator,
  renderSymbol
) {
  if (typeof separator === "undefined") {
    separator = ", ";
  }

  if (!renderSymbol) {
    renderSymbol = formatSymbol;
  }

  const elements = symbols.map((symbol, index) => {
    const renderedSymbol = renderSymbol(symbol, info);
    if (index > 0) {
      return h(Fragment, { key: index }, separator, renderedSymbol);
    } else {
      return renderedSymbol;
    }
  });

  // Wrap in Fragment for Trans component compatibility
  return h(Fragment, null, ...elements);
}

/**
 * Format sentence with custom renderer for i18n Trans component
 * @param {Array} sentence - Sentence to format
 * @param {Object} info - Symbol information
 * @param {Function} renderSymbol - Custom render function for each symbol (default: formatSymbol)
 * @returns {Array} Formatted sentence as React elements
 */
export function formatSentenceWithRenderer(sentence, info, renderSymbol) {
  if (!renderSymbol) {
    renderSymbol = formatSymbol;
  }

  if (sentence.length === 0) {
    return renderSymbol(EPSILON, info);
  }

  return formatSymbolListWithRenderer(sentence, info, " ", renderSymbol);
}

/**
 * Format production with custom renderer for i18n Trans component
 * @param {Array} production - Production to format
 * @param {Object} info - Symbol information
 * @param {Function} renderSymbol - Custom render function for each symbol (default: formatSymbol)
 * @returns {Array} Formatted production as React elements
 */
export function formatProductionWithRenderer(production, info, renderSymbol) {
  if (!renderSymbol) {
    renderSymbol = formatSymbol;
  }

  let symbols;

  if (production.length > 1) {
    symbols = formatSymbolListWithRenderer(
      production.slice(1),
      info,
      " ",
      renderSymbol
    );
  } else {
    symbols = renderSymbol(EPSILON, info);
  }

  return h(
    Fragment,
    null,
    renderSymbol(production[0], info),
    " ",
    ARROW,
    " ",
    symbols
  );
}

function prettifySymbol(symbol) {
  return symbol.split(NONPRINTING_PATTERN).map((str, index) => {
    if (index % 2 == 1) {
      return h("span", { className: "np" }, NONPRINTING[str] || SPACE);
    } else {
      return str;
    }
  });
}

export function formatSymbol(symbol, info) {
  if (symbol == END) {
    return h("u", null, "$");
  } else if (info.nonterminals.has(symbol)) {
    return h("i", null, prettifySymbol(symbol));
  } else if (info.terminals.has(symbol)) {
    return h("b", null, prettifySymbol(symbol));
  } else {
    throw new Error("Unknown symbol: " + symbol);
  }
}

export function formatProduction(production, info) {
  let symbols;

  if (production.length > 1) {
    symbols = formatSymbolList(production.slice(1), info, " ");
  } else {
    symbols = h("u", null, EPSILON);
  }

  return h(
    Fragment,
    null,
    formatSymbol(production[0], info),
    " ",
    ARROW,
    " ",
    symbols
  );
}

export function formatSentence(sentence, info) {
  if (sentence.length === 0) {
    return h("u", null, EPSILON);
  }

  return formatSymbolList(sentence, info, " ");
}

export function escapeString(string) {
  return string
    .replaceAll(/[&<>"]/g, function (name) {
      return ESCAPE[name];
    })
    .replaceAll("\\", "\\\\");
}

function barePrettifySymbol(symbol) {
  return symbol
    .split(NONPRINTING_PATTERN)
    .map((str, index) => {
      if (index % 2 == 1) {
        return BARE_NONPRINTING[str] || SPACE;
      } else {
        return str;
      }
    })
    .join("");
}

export function bareFormatSymbol(symbol, info) {
  if (symbol == END) {
    return "$";
  } else if (info.nonterminals.has(symbol) || info.terminals.has(symbol)) {
    return barePrettifySymbol(escapeString(symbol));
  } else {
    throw new Error("Unknown symbol: " + symbol);
  }
}

export function bareFormatSymbols(symbols, info) {
  let result = [];

  for (let i = 0; i < symbols.length; i++) {
    result.push(bareFormatSymbol(symbols[i], info));
  }

  return result;
}

export function bareFormatItem(item, start, productions, info) {
  let production;

  if (item.production === -1) {
    if (item.index === 0) {
      production = "&bull; " + bareFormatSymbol(start, info);
    } else {
      production = bareFormatSymbol(start, info) + " &bull;";
    }
  } else {
    let symbols = bareFormatSymbols(
      productions[item.production].slice(1),
      info
    );
    symbols.splice(item.index, 0, "&bull;");

    production =
      bareFormatSymbol(productions[item.production][0], info) +
      " &rarr; " +
      symbols.join(" ");
  }

  if (item.lookaheads) {
    return (
      "[" +
      production +
      ", " +
      bareFormatSymbols(item.lookaheads, info).join(" / ") +
      "]"
    );
  } else if (item.lookahead) {
    return (
      "[" + production + ", " + bareFormatSymbol(item.lookahead, info) + "]"
    );
  } else {
    return production;
  }
}

const TRANSFORMATION_FORMATTERS = {
  expand: function (transformation, productions, info, t) {
    return t("grammar.transformations.expand");
  },

  removeImmediateLeftRecursion: function (
    transformation,
    productions,
    info,
    t
  ) {
    return t("grammar.transformations.removeImmediateLeftRecursion");
  },

  leftFactor: function (transformation, productions, info, t) {
    const symbols = bareFormatSymbols(
      productions[transformation.production].slice(
        1,
        transformation.length + 1
      ),
      info
    ).join(" ");
    return t("grammar.transformations.leftFactor", { symbols });
  },

  epsilonSeparate: function (transformation, productions, info, t) {
    return t("grammar.transformations.epsilonSeparate");
  },

  removeUnreachable: function (transformation, productions, info, t) {
    return t("grammar.transformations.removeUnreachable");
  }
};

export function formatTransformation(transformation, productions, info, t) {
  return (
    TRANSFORMATION_FORMATTERS[transformation.name](
      transformation,
      productions,
      info,
      t
    ) || transformation.name
  );
}
