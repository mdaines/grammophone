import * as Calculations from "../../../src/grammar/calculations/index.js";
import Grammar from "../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("immutability", function() {
  it("calling a calculation should not modify the results of another", function() {
    const keys = Object.keys(Calculations);

    for (const k1 of keys) {
      for (const k2 of keys) {
        const grammar = new Grammar([
          ["S'", "S"],
          ["S", "L", "assign", "R"],
          ["S", "R"],
          ["L", "*", "R"],
          ["L", "id"],
          ["R", "L"]
        ]);
        const k1Result = structuredClone(grammar.calculations[k1]);
        const k2Result = structuredClone(grammar.calculations[k2]); // eslint-disable-line no-unused-vars
        const k1Result2 = structuredClone(grammar.calculations[k1]);

        assert.deepStrictEqual(k1Result, k1Result2, `Calculations not immutable when calling ${k1} then ${k2}`);
      }
    }
  });
});
