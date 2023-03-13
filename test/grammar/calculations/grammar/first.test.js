import Relation from "../../../../src/relation.js";
import Grammar from "../../../../src/grammar/index.js";
import Fixtures from "../../../fixtures/louden.js";
import assert from "node:assert/strict";

describe("first", function() {
  it("returns the first sets of the nonterminals as a relation", function() {
    const grammar = new Grammar([
      ["S", "A", "a", "S", "b"],
      ["S", "x"],
      ["A", "y"],
      ["A", "B"],
      ["A"],
      ["B", "z"]
    ]);

    assert.deepStrictEqual(
      grammar.calculations.first,
      new Relation([
        ["S", "a"],
        ["S", "x"],
        ["S", "y"],
        ["S", "z"],
        ["A", "y"],
        ["A", "z"],
        ["B", "z"]
      ]));
  });

  it("returns the expected results from Louden fixtures", function() {
    assert.deepStrictEqual(new Grammar(Fixtures.expressions).calculations.first, new Relation([
      ["addop", "+"],
      ["addop", "-"],
      ["mulop", "*"],
      ["factor", "("],
      ["factor", "number"],
      ["exp", "("],
      ["exp", "number"],
      ["term", "("],
      ["term", "number"]
    ]));

    assert.deepStrictEqual(new Grammar(Fixtures.ifelse).calculations.first, new Relation([
      ["statement", "other"],
      ["statement", "if"],
      ["if-stmt", "if"],
      ["else-part", "else"],
      ["exp", "0"],
      ["exp", "1"]
    ]));

    assert.deepStrictEqual(new Grammar(Fixtures.statements).calculations.first, new Relation([
      ["stmt-seq'", ";"],
      ["stmt", "s"],
      ["stmt-sequence", "s"]
    ]));
  });
});
