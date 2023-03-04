import Grammar from "../src/grammar/index.js";
import assert from "node:assert/strict";

describe("Grammar", function() {
  describe("constructor", function() {
    it("validates productions", function() {
      assert.throws(function() { new Grammar({ a: "1" }); });
      assert.throws(function() { new Grammar([{ a: "1" }]); });
      assert.throws(function() { new Grammar([[123]]); });
      assert.throws(function() { new Grammar([["A", "Grammar.END"]]); });
      assert.throws(function() { new Grammar([["A", ""]]); });
      assert.throws(function() { new Grammar([[]]); });
      assert.throws(function() { new Grammar([]); });

      assert.doesNotThrow(function() { new Grammar([["A"]]); });
      assert.doesNotThrow(function() { new Grammar([["A", "a"]]); });
    });
  });

  describe("getNewSymbol", function() {
    it("returns a symbol not already in the grammar", function() {
      let grammar = new Grammar([["A", "a", "a2"], ["B2", "B3"]]);

      assert.deepStrictEqual(grammar.getNewSymbol("A"), "A2");
      assert.deepStrictEqual(grammar.getNewSymbol("a"), "a3");
      assert.deepStrictEqual(grammar.getNewSymbol("a2"), "a3");
      assert.deepStrictEqual(grammar.getNewSymbol("B2"), "B4");
      assert.deepStrictEqual(grammar.getNewSymbol("B3"), "B4");
    });

    it("returns the same symbol if the symbol is not in the grammar", function() {
      let grammar = new Grammar([["A", "a"]]);

      assert.deepStrictEqual(grammar.getNewSymbol("x"), "x");
    });
  });
});
