import { parser } from "./rules.js";

const ESCAPES = {
  "0": "\0",
  "n": "\n",
  "r": "\r",
  "v": "\v",
  "t": "\t",
  "b": "\b",
  "f": "\f",
  "\n": "",
  "\r": ""
};

function interpretEscapes(str) {
  return str.replaceAll(/\\(?:x([0-9a-fA-F]{2})|u(?:\{([0-9a-fA-F]+)\}|([0-9a-fA-F]{4})))/g, function(_, hex, u1, u2) {
    return String.fromCodePoint(parseInt(hex || u1 || u2, 16));
  }).replaceAll(/\\(.)/gs, function(_, char) {
    return ESCAPES[char] || char;
  });
}

export default function(src) {
  let tree = parser.parse(src);
  let cursor = tree.cursor();

  let productions = [];
  let production;
  let head;

  do {
    if (cursor.type.isError) {
      return { error: new Error("Parse error") };
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
      let symbol = interpretEscapes(src.slice(cursor.from + 1, cursor.to - 1));

      if (typeof production === "undefined") {
        head = symbol;
      } else {
        production.push(symbol);
      }
    }
  } while (cursor.next());

  return { productions };
}
