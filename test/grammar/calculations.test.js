import Grammar from "../../src/grammar/index.js";
import Calculations from "../../src/grammar/calculations/index.js";
import exampleGrammars from "../fixtures/example_grammars.js";
import exampleOutput from "../fixtures/example_output.js";
import { replacer } from "../fixtures/serialization.js";
import assert from "node:assert/strict";

describe("output for example grammars", function() {
  Object.keys(exampleGrammars).forEach(function(exampleName) {
    let grammar = new Grammar(exampleGrammars[exampleName]);

    Object.keys(Calculations).forEach(function(calculationName) {
      it(`${exampleName} ${calculationName}`, function() {
        let result = grammar.calculate(calculationName);
        let json = JSON.stringify(result, replacer);
        let parsed = JSON.parse(json);

        assert.deepStrictEqual(parsed, exampleOutput[exampleName][calculationName]);
      });
    });
  });
});
