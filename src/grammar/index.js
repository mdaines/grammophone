import { makeCalculationsMemo } from "./calculations_memo.js";
import {
  makeSentencesIterator,
  ambiguousSentenceExample
} from "./sentences.js";
import { quoteSymbol } from "./symbols.js";

export default class Grammar {
  constructor(productions) {
    var i, j;

    if (!(productions instanceof Array)) {
      throw { key: "grammar.error.productionsMustBeArray" };
    }

    if (productions.length < 1) {
      throw { key: "grammar.error.grammarMustHaveProduction" };
    }

    for (i = 0; i < productions.length; i++) {
      if (!(productions[i] instanceof Array)) {
        throw { key: "grammar.error.productionsMustBeArrays" };
      }

      if (productions[i].length < 1) {
        throw { key: "grammar.error.productionMustHaveSymbol" };
      }

      for (j = 0; j < productions[i].length; j++) {
        if (typeof productions[i][j] !== "string") {
          throw { key: "grammar.error.productionSymbolsMustBeStrings" };
        }

        if (productions[i][j].match(/^Grammar\./)) {
          throw {
            key: "grammar.error.reservedSymbol",
            options: { symbol: productions[i][j] }
          };
        }

        if (productions[i][j] === "") {
          throw { key: "grammar.error.emptySymbolNotAllowed" };
        }
      }
    }

    this.productions = productions;
  }

  transform(transformation) {
    var productions = this.productions.slice();

    transformation.changes.forEach(function (change) {
      if (change.operation === "delete") {
        productions.splice(change.index, 1);
      } else if (change.operation === "insert") {
        productions.splice(change.index, 0, change.production);
      }
    });

    return new Grammar(productions);
  }

  toString() {
    let result = "";

    for (let i = 0; i < this.productions.length; i++) {
      result += quoteSymbol(this.productions[i][0]);
      result += " ->";

      for (let j = 1; j < this.productions[i].length; j++) {
        result += " " + quoteSymbol(this.productions[i][j]);
      }

      result += " .\n";
    }

    return result;
  }

  exampleSentences() {
    return makeSentencesIterator(this);
  }

  get ambiguousSentenceExample() {
    return ambiguousSentenceExample(this);
  }

  get calculations() {
    const calculations = makeCalculationsMemo(this.productions);

    Object.defineProperty(this, "calculations", {
      value: calculations,
      enumerable: true
    });
    return this.calculations;
  }
}
