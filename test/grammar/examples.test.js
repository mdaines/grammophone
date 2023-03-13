import * as Calculations from "../../src/grammar/calculations/index.js";
import Grammar from "../../src/grammar/index.js";
import exampleGrammars from "../fixtures/example_grammars.js";
import exampleOutput from "../fixtures/example_output.js";
import { replacer } from "../fixtures/serialization.js";
import assert from "node:assert/strict";

describe("output for example grammars", function() {
  for (let exampleName of Object.keys(exampleGrammars)) {
    for (let calculationName of Object.keys(Calculations)) {
      it(`${exampleName} ${calculationName}`, function() {
        const grammar = new Grammar(exampleGrammars[exampleName]);
        const result = grammar.calculations[calculationName];
        const json = JSON.stringify(result, replacer);
        const parsed = JSON.parse(json);

        assert.deepStrictEqual(parsed, exampleOutput[exampleName][calculationName]);
      });
    }
  }
});
