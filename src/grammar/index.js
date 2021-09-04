const Calculations = require("./calculations");
const END = require("./symbols").END;

module.exports = class Grammar {
  constructor(productions) {
    var i, j;

    if (!(productions instanceof Array)) {
      throw new Error("List of productions must be an array");
    }

    if (productions.length < 1) {
      throw new Error("A grammar must have at least one production");
    }

    for (i = 0; i < productions.length; i++) {
      if (!(productions[i] instanceof Array)) {
        throw new Error("Productions must be arrays");
      }

      if (productions[i].length < 1) {
        throw new Error("Productions must have at least one symbol");
      }

      for (j = 0; j < productions[i].length; j++) {
        if (typeof productions[i][j] !== "string") {
          throw new Error("Production symbols must be strings");
        }

        if (productions[i][j].match(/^Grammar\./)) {
          throw new Error("Reserved symbol " + productions[i][j] + " may not be part of a production");
        }

        if (productions[i][j] === "") {
          throw new Error("An empty symbol may not be part of a production");
        }
      }
    }

    this.productions = productions;
    this.calculations = {};
  }

  calculate(name) {

    if (typeof Calculations[name] === "undefined") {
      throw new Error("Undefined grammar calculation " + name);
    }

    if (typeof this.calculations[name] === "undefined") {
      this.calculations[name] = Calculations[name](this);
    }

    return this.calculations[name];

  }

  transform(transformation) {

    var productions = this.productions.slice();

    transformation.changes.forEach(function(change) {

      if (change.operation === "delete") {
        productions.splice(change.index, 1);
      } else if (change.operation === "insert") {
        productions.splice(change.index, 0, change.production);
      }

    });

    return new Grammar(productions);

  }

  getNewSymbol(symbol) {
    let symbols = this.calculate("grammar.symbols");

    if (!symbols.has(symbol)) {
      return symbol;
    }

    let match = symbol.match(/(\d+)$/);
    let base, number;

    if (match) {
      base = symbol.substring(0, match.index);
      number = parseInt(match[1], 10) + 1;
    } else {
      base = symbol;
      number = 2;
    }

    let newSymbol;

    do {
      newSymbol = base + String(number);
      number += 1;
    } while (symbols.has(newSymbol));

    return newSymbol;
  }

  getFirst(symbols) {

    var i, k;
    var s;
    var result;

    var first = this.calculate("grammar.first");
    var nullable = this.calculate("grammar.nullable");
    var terminals = this.calculate("grammar.terminals");
    var nonterminals = this.calculate("grammar.nonterminals");

    result = new Set();

    for (i = 0; i < symbols.length; i++) {

      s = symbols[i];

      if (s === END) {

        result.add(s);
        break;

      } else if (terminals.has(s)) {

        result.add(s);
        break;

      } else if (nonterminals.has(s)) {

        for (k of first.get(s)) {
          result.add(k);
        }

        if (!nullable.has(s)) {
          break;
        }

      } else {

        throw new Error("Unexpected symbol " + s);

      }

    }

    return result;

  }

  isNullable(symbols) {

    var i, s;

    var nullable = this.calculate("grammar.nullable");
    var terminals = this.calculate("grammar.terminals");
    var nonterminals = this.calculate("grammar.nonterminals");

    for (i = 0; i < symbols.length; i++) {

      s = symbols[i];

      if (nonterminals.has(s)) {

        if (!nullable.has(s)) {
          return false;
        }

      } else if (terminals.has(s)) {

        return false;

      } else {

        throw new Error("Unexpected symbol " + s);

      }

    }

    return true;

  }

  copyProductions() {

    var i, j;
    var result = [];

    for (i = 0; i < this.productions.length; i++) {
      result[i] = [];

      for (j = 0; j < this.productions[i].length; j++) {
        result[i][j] = this.productions[i][j];
      }
    }

    return result;

  }

  toString() {

    var i, j;
    var result = "";

    for (i = 0; i < this.productions.length; i++) {

      result += this.productions[i][0];
      result += " ->";

      for (j = 1; j < this.productions[i].length; j++) {
        result += " " + this.productions[i][j];
      }

      result += " .\n";

    }

    return result;

  }
}
