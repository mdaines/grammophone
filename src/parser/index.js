const parser = require("./rules").parser;

module.exports = function(src) {
  let tree = parser.parse(src);
  let cursor = tree.cursor();

  let productions = [];
  let head;
  let production;

  do {
    if (cursor.type.isError) {
      throw new Error("Parse error");
    }

    if (cursor.name === "HeadSymbol") {
      head = src.slice(cursor.from, cursor.to);
    } else if (cursor.name === "Production") {
      production = [head];
      productions.push(production);
    } else if (cursor.name === "ProductionSymbol") {
      production.push(src.slice(cursor.from, cursor.to));
    }
  } while (cursor.next());

  return productions;
}
