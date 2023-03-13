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

  describe("calculations", function() {
    it("returns an object with memoized calculation getters", function() {
      const grammar = new Grammar([["A", "a"]]);

      assert.deepStrictEqual(grammar.calculations.symbols, new Set(["A", "a"]));
      assert.deepStrictEqual(Object.getOwnPropertyDescriptor(grammar.calculations, "symbols").value, new Set(["A", "a"]));
    });
  });
});
