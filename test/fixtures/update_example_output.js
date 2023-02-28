/* eslint-env node */

const Grammar = require("../../src/grammar");
const Calculations = require("../../src/grammar/calculations");
const exampleGrammars = require("./example_grammars");
const fs = require("fs");
const path = require("path");
const prepare = require("./serialization").prepare;

let output = {};

Object.keys(exampleGrammars).forEach(function(exampleName) {
  let grammar = new Grammar(exampleGrammars[exampleName]);

  output[exampleName] = {};

  Object.keys(Calculations).forEach(function(calculationName) {
    let result = grammar.calculate(calculationName);

    output[exampleName][calculationName] = prepare(calculationName, result);
  });
});

let script = `// This file is generated automatically.
// See update_example_output.js

module.exports = ${JSON.stringify(output, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, "example_output.js"), script);
