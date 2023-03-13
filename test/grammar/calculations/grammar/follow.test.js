import { END } from "../../../../src/grammar/symbols.js";
import Relation from "../../../../src/relation.js";
import Grammar from "../../../../src/grammar/index.js";
import Fixtures from "../../../fixtures/louden.js";
import assert from "node:assert/strict";

describe("follow", function() {
  it("returns the follow sets of the nonterminals as a relation", function() {
    const grammar = new Grammar([
      ["A", "B", "a"],
      ["B", "C", "b"],
      ["B", "C"],
      ["C"]
    ]);

    assert.deepStrictEqual(
      grammar.calculations.follow,
      new Relation([
        ["A", END],
        ["B", "a"],
        ["C", "a"],
        ["C", "b"]
      ]));
  });

  it("returns the expected results from Louden fixtures", function() {
    assert.deepStrictEqual(new Grammar(Fixtures.expressions).calculations.follow, new Relation([
      ["exp", END],
      ["exp", "+"],
      ["exp", "-"],
      ["exp", ")"],
      ["addop", "("],
      ["addop", "number"],
      ["term", "*"],
      ["term", END],
      ["term", "+"],
      ["term", "-"],
      ["term", ")"],
      ["mulop", "("],
      ["mulop", "number"],
      ["factor", "*"],
      ["factor", END],
      ["factor", "+"],
      ["factor", "-"],
      ["factor", ")"]
    ]));

    assert.deepStrictEqual(new Grammar(Fixtures.ifelse).calculations.follow, new Relation([
      ["statement", END],
      ["statement", "else"],
      ["exp", ")"],
      ["if-stmt", END],
      ["if-stmt", "else"],
      ["else-part", END],
      ["else-part", "else"]
    ]));

    assert.deepStrictEqual(new Grammar(Fixtures.statements).calculations.follow, new Relation([
      ["stmt-sequence", END],
      ["stmt", ";"],
      ["stmt", END],
      ["stmt-seq'", END]
    ]));
  });
});
