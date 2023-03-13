import Grammar from "../../../../src/grammar/index.js";
import Fixtures from "../../../fixtures/louden.js";
import assert from "node:assert/strict";

describe("nullable", function() {
  it("returns the set of the grammar's nullable symbols", function() {
    const grammar = new Grammar([
      ["A", "a", "B", "b"],
      ["B", "A"],
      ["B"],
      ["C", "x"]
    ]);

    assert.deepStrictEqual(grammar.calculations.nullable, new Set(["B"]));
  });

  it("returns the expected results from Louden fixtures", function() {
    assert.deepStrictEqual(new Grammar(Fixtures.expressions).calculations.nullable, new Set());
    assert.deepStrictEqual(new Grammar(Fixtures.ifelse).calculations.nullable, new Set(["else-part"]));
    assert.deepStrictEqual(new Grammar(Fixtures.statements).calculations.nullable, new Set(["stmt-seq'"]));
  });
});
