import Grammar from "../../../../src/grammar/index.js";
import { isNullable } from "../../../../src/grammar/calculations/parsing/helpers.js";
import assert from "node:assert/strict";

describe("isNullable", function() {
  it("returns true if the sentence is nullable", function() {
    const grammar = new Grammar([
      ["A", "a", "A", "b"],
      ["A", "B"],
      ["B"]
    ]);

    assert.deepStrictEqual(isNullable(grammar.calculations, ["a", "b"]), false);
    assert.deepStrictEqual(isNullable(grammar.calculations, ["A"]), true);
    assert.deepStrictEqual(isNullable(grammar.calculations, ["B"]), true);
  });

  it("throws if the sentence contains a symbol not in the grammar", function() {
    const grammar = new Grammar([["A", "a"]]);

    assert.throws(function() { isNullable(grammar.calculations, ["B"]); });
  });
});
