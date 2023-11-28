/* eslint-env node */

import Grammar from "../../src/grammar/index.js";
import exampleGrammars from "./example_grammars.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { replacer } from "./serialization.js";

let output = {};

let exampleNames = Object.keys(exampleGrammars).sort();

for (let exampleName of exampleNames) {
  let grammar = new Grammar(exampleGrammars[exampleName]);

  output[exampleName] = {};

  let calculationNames = Object.keys(grammar.calculations).sort();

  for (let calculationName of calculationNames) {
    output[exampleName][calculationName] = grammar.calculations[calculationName];
  }
}

let script = `// This file is generated automatically.
// See update_example_output.js

export default ${JSON.stringify(output, replacer, 2)};\n`;

let dir = path.dirname(fileURLToPath(import.meta.url));

fs.writeFileSync(path.join(dir, "example_output.js"), script);
