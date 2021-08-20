const Grammar = require("../../src/grammar");
const Calculations = require("../../src/grammar/calculations");
const exampleGrammars = require("../fixtures/example_grammars");
const exampleOutput = require("../fixtures/example_output");

describe("output for example grammars", function() {
  Object.keys(exampleGrammars).forEach(function(exampleName) {
    let grammar = new Grammar(exampleGrammars[exampleName]);

    Object.keys(Calculations).forEach(function(calculationName) {
      it(`${exampleName} ${calculationName}`, function() {
        expect(grammar.calculate(calculationName)).toEqual(exampleOutput[exampleName][calculationName]);
      });
    });
  });
});
