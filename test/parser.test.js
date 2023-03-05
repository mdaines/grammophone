import parser from "../src/parser/index.js";
import assert from "node:assert/strict";

describe("parser", function() {
  it("basics", function() {
    assert.deepStrictEqual(parser("A -> a ."), [["A", "a"]]);
    assert.deepStrictEqual(parser("A -> a | b ."), [["A", "a"], ["A", "b"]]);
    assert.deepStrictEqual(parser("A -> ."), [["A"]]);
    assert.deepStrictEqual(parser("A -> a. B -> b. A -> c."), [["A", "a"], ["B", "b"], ["A", "c"]]);
  });

  it("colon and semicolon can be used to define rules", function() {
    assert.deepStrictEqual(parser("A : a ;"), [["A", "a"]]);
    assert.deepStrictEqual(parser("A : a | b ;"), [["A", "a"], ["A", "b"]]);
    assert.deepStrictEqual(parser("A : ;"), [["A"]]);
    assert.deepStrictEqual(parser("A : a; B : b; A : c;"), [["A", "a"], ["B", "b"], ["A", "c"]]);
  });

  it("spacing", function() {
    assert.deepStrictEqual(parser("A->a."), [["A", "a"]]);
    assert.deepStrictEqual(parser("A->a|b."), [["A", "a"], ["A", "b"]]);
    assert.deepStrictEqual(parser("A->."), [["A"]]);
  });

  it("symbols can contain numbers", function() {
    assert.deepStrictEqual(parser("A -> a1 ."), [["A", "a1"]]);
  });

  it("symbols can contain dollar and underscore", function() {
    assert.deepStrictEqual(parser("$ -> _ ."), [["$", "_"]]);
    assert.deepStrictEqual(parser("$a -> _1 a_2 ."), [["$a", "_1", "a_2"]]);
  });

  it("symbols can be quoted", function() {
    assert.deepStrictEqual(parser("\"A\" -> \"a\"."), [["A", "a"]]);
    assert.deepStrictEqual(parser("\"->\" -> ."), [["->"]]);
  });

  it("quoted symbols can contain escapes", function() {
    assert.deepStrictEqual(parser("\"\\\"\" -> ."), [["\\\""]]);
    assert.deepStrictEqual(parser("\"\\\\\" -> ."), [["\\\\"]]);
    assert.deepStrictEqual(parser("\"'\" -> ."), [["'"]]);
    assert.deepStrictEqual(parser("'\\'' -> ."), [["\\'"]]);
    assert.deepStrictEqual(parser("'\"' -> ."), [["\""]]);

    assert.deepStrictEqual(parser("\"\\b\" -> ."), [["\\b"]]);
    assert.deepStrictEqual(parser("\"\\f\" -> ."), [["\\f"]]);
    assert.deepStrictEqual(parser("\"\\n\" -> ."), [["\\n"]]);
    assert.deepStrictEqual(parser("\"\\r\" -> ."), [["\\r"]]);
    assert.deepStrictEqual(parser("\"\\t\" -> ."), [["\\t"]]);
    assert.deepStrictEqual(parser("\"\\v\" -> ."), [["\\v"]]);
    assert.deepStrictEqual(parser("\"\\0\" -> ."), [["\\0"]]);

    assert.deepStrictEqual(parser("\"\\xA9\" -> ."), [["\\xA9"]]);
    assert.deepStrictEqual(parser("\"\\xa9\" -> ."), [["\\xa9"]]);

    assert.deepStrictEqual(parser("\"\\u00A9\" -> ."), [["\\u00A9"]]);
    assert.deepStrictEqual(parser("\"\\u00a9\" -> ."), [["\\u00a9"]]);
    assert.deepStrictEqual(parser("\"\\u2665\" -> ."), [["\\u2665"]]);

    assert.deepStrictEqual(parser("\"\\u{1D306}\" -> ."), [["\\u{1D306}"]]);
  });

  it("nonterminals don't need to be capitalized", function() {
    assert.deepStrictEqual(parser("a -> b ."), [["a", "b"]]);
  });

  it("terminals can be capitalized", function() {
    assert.deepStrictEqual(parser("a -> B ."), [["a", "B"]]);
  });

  it("multiple lines", function() {
    assert.deepStrictEqual(parser("A -> a |\n  b\n  ."), [["A", "a"], ["A", "b"]]);
  });

  it("comments", function() {
    assert.deepStrictEqual(parser("# A -> a .\nA -> b ."), [["A", "b"]]);
    assert.deepStrictEqual(parser("# abc\n\nA -> b ."), [["A", "b"]]);
    assert.deepStrictEqual(parser("# 123\n\n"), []);
  });

  describe("errors", function() {
    it("missing arrow", function() {
      assert.throws(function() { parser("A -> a. B"); });
      assert.throws(function() { parser("A"); });
    });

    it("missing nonterminal", function() {
      assert.throws(function() { parser("A -> a. ->"); });
      assert.throws(function() { parser("-> X"); });
    });

    it("multiple nonterminals", function() {
      assert.throws(function() { parser("A B -> a."); });
    });

    it("stop that looks like part of a symbol", function() {
      assert.throws(function() { parser("A.y -> a."); });
      assert.throws(function() { parser("A -> x.y ."); });
    });

    it("rules can't mix definition styles", function() {
      assert.throws(function() { parser("A -> a ;"); });
      assert.throws(function() { parser("A : a ."); });
    });

    it("symbols can't start with a number", function() {
      assert.throws(function() { parser("A -> 1 ."); });
    });

    it("quoted symbols can't contain a newline", function() {
      assert.throws(function() { parser("\"A\n\" -> a ."); });
    });
  });
});
