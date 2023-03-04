import { bareFormatSymbol, formatSymbol } from "../src/components/helpers.js";
import { END } from "../src/grammar/symbols.js";
import assert from "node:assert/strict";

describe("helpers", function() {
  describe("formatSymbol", function() {
    it("formats END as $", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      let output = formatSymbol(END, info);

      assert.deepStrictEqual(output.type, "u");
      assert.deepStrictEqual(output.props, { children: "$" });
    });

    it("formats whitespace characters", function() {
      let info = {
        terminals: new Set([" "]),
        nonterminals: new Set()
      };

      let output = formatSymbol(" ", info);

      assert.deepStrictEqual(output.type, "b");
      assert.deepStrictEqual(output.props, { children: "\u2B1A" });
    });

    it("refuses to format an unknown symbol", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      assert.throws(function() { formatSymbol("x", info); });
    });
  });

  describe("bareFormatSymbol", function() {
    it("formats END as $", function() {
      assert.deepStrictEqual(bareFormatSymbol(END, {}), "$");
    });

    it("escapes HTML", function() {
      let info = {
        terminals: new Set(["&"]),
        nonterminals: new Set()
      };

      assert.deepStrictEqual(bareFormatSymbol("&", info), "&amp;");
    });

    it("formats whitespace characters", function() {
      let info = {
        terminals: new Set([" "]),
        nonterminals: new Set()
      };

      assert.deepStrictEqual(bareFormatSymbol(" ", info), "\u2B1A");
    });

    it("refuses to format an unknown symbol", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      assert.throws(function() { bareFormatSymbol("x", info); });
    });
  });
});
