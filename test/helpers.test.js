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

      assert.strictEqual(output.type, "b");
      assert.strictEqual(output.props.children[0], "");
      assert.strictEqual(output.props.children[1].type, "span");
      assert.strictEqual(output.props.children[1].props.className, "np");
      assert.strictEqual(output.props.children[1].props.children[0], "␣");
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

      assert.deepStrictEqual(bareFormatSymbol(" ", info), "␣");
    });

    it("double escapes other nonprinting characters", function() {
      let info = {
        terminals: new Set(["\n"]),
        nonterminals: new Set()
      };

      assert.deepStrictEqual(bareFormatSymbol("\n", info), "\\\\n");
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
