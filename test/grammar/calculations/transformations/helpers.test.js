import { getNewSymbol } from "../../../../src/grammar/calculations/transformations/helpers.js";
import assert from "node:assert/strict";

describe("getNewSymbol", function() {
  it("returns a symbol not already in the set of symbols", function() {
    assert.deepStrictEqual(getNewSymbol(new Set(["A", "a", "a2", "B2", "B3"]), "A"), "A2");
    assert.deepStrictEqual(getNewSymbol(new Set(["A", "a", "a2", "B2", "B3"]), "a"), "a3");
    assert.deepStrictEqual(getNewSymbol(new Set(["A", "a", "a2", "B2", "B3"]), "a2"), "a3");
    assert.deepStrictEqual(getNewSymbol(new Set(["A", "a", "a2", "B2", "B3"]), "B2"), "B4");
    assert.deepStrictEqual(getNewSymbol(new Set(["A", "a", "a2", "B2", "B3"]), "B3"), "B4");
  });

  it("returns the same symbol if the symbol is not in the grammar", function() {
    assert.deepStrictEqual(getNewSymbol(new Set(["A", "a"]), "x"), "x");
  });
});
