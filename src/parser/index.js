const parser = require("./rules").parser;

module.exports = function(src) {
  let tree = parser.parse(src);
  let cursor = tree.cursor();

  let productions = [];
  let production;
  let head;

  do {
    if (cursor.type.isError) {
      throw new Error("Parse error");
    }

    if (cursor.name === "Head") {
      production = undefined;
    } else if (cursor.name === "Production") {
      production = [head];
      productions.push(production);
    } else if (cursor.name === "Symbol") {
      let symbol = src.slice(cursor.from, cursor.to);

      if (typeof production === "undefined") {
        head = symbol;
      } else {
        production.push(symbol);
      }
    } else if (cursor.name === "QuotedSymbol") {
      let symbol = unescapeCharacters(src.slice(cursor.from + 1, cursor.to - 1));

      if (typeof production === "undefined") {
        head = symbol;
      } else {
        production.push(symbol);
      }
    }
  } while (cursor.next());

  return productions;
}

const escapePattern = /\\(?:u\{([0-9a-fA-F]{1,})\}|u([a-fA-F0-9]{4})|x([a-fA-F0-9]{2})|([bfnrtv0'"\\]))/g;

function unescapeCharacters(string) {
  return string.replace(escapePattern, function(_, codePoint, unicode, hex, single) {
    if (codePoint || unicode || hex) {
      return String.fromCodePoint(parseInt(codePoint || unicode || hex, 16));
    } else if (single == "b") {
      return "\b";
    } else if (single == "f") {
      return "\f";
    } else if (single == "n") {
      return "\n";
    } else if (single == "r") {
      return "\r";
    } else if (single == "t") {
      return "\t";
    } else if (single == "v") {
      return "\v";
    } else if (single == "0") {
      return "\0";
    } else {
      return single;
    }
  });
}
