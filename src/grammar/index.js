'use strict';

const Calculations = require('./calculations');
const Parser = require('./parser');
const END = require('./symbols').END;

class Grammar {

  static parse(spec) {

    if (spec.match(/^\s*$/)) {
      return { spec: spec };
    }

    try {

      // Parser gives us rules in the following form:
      //
      //   { nt: "A", p: [["a", "b"], []] }
      //
      // We want an array of productions in this form:
      //
      //   [["A", "a", "b"], ["A"]]
      //
      // Note that depending on the grammar specification, productions
      // for a particular nonterminal may be at different places in the
      // list. We want to preserve the order in the user's input.

      let rules = Parser.parse(spec);
      let productions = [];

      for (let i = 0; i < rules.length; i++) {
        for (let j = 0; j < rules[i].p.length; j++) {
          productions.push([rules[i].nt].concat(rules[i].p[j]));
        }
      }

      return { grammar: new Grammar(productions), spec: spec };

    } catch (e) {

      return { error: e, spec: spec };

    }

  }

  constructor(productions) {

    // Check for reserved and empty symbols

    for (let i = 0; i < productions.length; i++) {
      for (let j = 0; j < productions[i].length; j++) {

        if (productions[i][j].match(/^Grammar\./)) {
          throw new Error("Reserved symbol " + productions[i][j] + " may not be part of a production");
        }

        if (productions[i][j] === "") {
          throw new Error("An empty symbol may not be part of a production");
        }

      }
    }

    // Assign productions

    this.productions = productions;

    // Initialize calculations memoization

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

    let productions = this.productions.slice();

    transformation.changes.forEach(function(change) {

      if (change.operation === "delete") {
        productions.splice(change.index, 1);
      } else if (change.operation === "insert") {
        productions.splice(change.index, 0, change.production);
      }

    });

    return new Grammar(productions);

  }

  getFirst(symbols) {

    let first = this.calculate("grammar.first");
    let nullable = this.calculate("grammar.nullable");
    let terminals = this.calculate("grammar.terminals");
    let nonterminals = this.calculate("grammar.nonterminals");

    let result = {};

    for (let i = 0; i < symbols.length; i++) {

      let s = symbols[i];

      if (s === END) {

        result[s] = true;
        break;

      } else if (terminals[s]) {

        result[s] = true;
        break;

      } else if (nonterminals[s]) {

        for (let k in first[s]) {
          result[k] = true;
        }

        if (!nullable[s]) {
          break;
        }

      } else {

        throw new Error("Unexpected symbol " + s);

      }

    }

    return result;

  }

  isNullable(symbols) {

    let nullable = this.calculate("grammar.nullable");
    let terminals = this.calculate("grammar.terminals");
    let nonterminals = this.calculate("grammar.nonterminals");

    for (let i = 0; i < symbols.length; i++) {

      let s = symbols[i];

      if (nonterminals[s]) {

        if (!nullable[s]) {
          return false;
        }

      } else if (terminals[s]) {

        return false;

      } else {

        throw new Error("Unexpected symbol " + s);

      }

    }

    return true;

  }

  copyProductions() {

    let result = [];

    for (let i = 0; i < this.productions.length; i++) {
      result[i] = [];

      for (let j = 0; j < this.productions[i].length; j++) {
        result[i][j] = this.productions[i][j];
      }
    }

    return result;

  }

  toString() {

    let result = "";

    for (let i = 0; i < this.productions.length; i++) {

      result += this.productions[i][0];
      result += " ->";

      for (let j = 1; j < this.productions[i].length; j++) {
        result += " " + this.productions[i][j];
      }

      result += " .\n";

    }

    return result;

  }

}

// export

Grammar.END = END;

module.exports = Grammar;
