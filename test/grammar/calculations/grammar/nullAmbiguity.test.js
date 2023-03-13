import Grammar from "../../../../src/grammar/index.js";
import assert from "node:assert/strict";

describe("nullAmbiguity", function() {
  it("returns indexes of productions for a nonterminal that are both nullable, if any", function() {
    const grammar = new Grammar([
      ["A", "B"],
      ["A"],
      ["B"]
    ]);

    assert.deepStrictEqual(grammar.calculations.nullAmbiguity, [0, 1]);
  });

  it("returns an empty array if there is no null ambiguity", function() {
    const grammar = new Grammar([
      ["A", "a", "B", "b"],
      ["A"]
    ]);

    assert.deepStrictEqual(grammar.calculations.nullAmbiguity, []);
  });
});
