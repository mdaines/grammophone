const Grammar = require("../../src/grammar");
const Calculations = require("../../src/grammar/calculations");
const exampleGrammars = require("../fixtures/example_grammars");
const exampleOutput = require("../fixtures/example_output");
const prepare = require("../fixtures/serialization").prepare;

describe("output for example grammars", function() {
  Object.keys(exampleGrammars).forEach(function(exampleName) {
    let grammar = new Grammar(exampleGrammars[exampleName]);

    Object.keys(Calculations).forEach(function(calculationName) {
      it(`${exampleName} ${calculationName}`, function() {
        let result = grammar.calculate(calculationName);

        expect(prepare(calculationName, result)).toEqual(exampleOutput[exampleName][calculationName]);
      });
    });
  });
});
