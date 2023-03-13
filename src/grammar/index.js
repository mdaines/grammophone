import { makeCalculationsMemo } from "./calculations_memo.js";
import { makeSentencesIterator, ambiguousSentenceExample } from "./sentences.js";

export default class Grammar {
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

  exampleSentences() {
    return makeSentencesIterator(this);
  }

  get ambiguousSentenceExample() {
    return ambiguousSentenceExample(this);
  }

  get calculations() {
    const calculations = makeCalculationsMemo(this.productions);

    Object.defineProperty(this, "calculations", { value: calculations, enumerable: true });
    return this.calculations;
  }
}
