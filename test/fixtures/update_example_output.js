/* eslint-env node */

import Grammar from "../../src/grammar/index.js";
import Calculations from "../../src/grammar/calculations/index.js";
import exampleGrammars from "./example_grammars.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prepare } from "./serialization.js";

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

export default ${JSON.stringify(output, null, 2)};\n`;

let dir = path.dirname(fileURLToPath(import.meta.url));

fs.writeFileSync(path.join(dir, "example_output.js"), script);
