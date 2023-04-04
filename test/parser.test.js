import parser from "../src/parser/index.js";
import assert from "node:assert/strict";

describe("parser", function() {
  it("basics", function() {
    assert.deepStrictEqual(parser("A -> a ."), { productions: [["A", "a"]] });
    assert.deepStrictEqual(parser("A -> a | b ."), { productions: [["A", "a"], ["A", "b"]] });
    assert.deepStrictEqual(parser("A -> ."), { productions: [["A"]] });
    assert.deepStrictEqual(parser("A -> a. B -> b. A -> c."), { productions: [["A", "a"], ["B", "b"], ["A", "c"]] });
  });

  it("colon and semicolon can be used to define rules", function() {
    assert.deepStrictEqual(parser("A : a ;"), { productions: [["A", "a"]] });
    assert.deepStrictEqual(parser("A : a | b ;"), { productions: [["A", "a"], ["A", "b"]] });
    assert.deepStrictEqual(parser("A : ;"), { productions: [["A"]] });
    assert.deepStrictEqual(parser("A : a; B : b; A : c;"), { productions: [["A", "a"], ["B", "b"], ["A", "c"]] });
  });

  it("spacing", function() {
    assert.deepStrictEqual(parser("A->a."), { productions: [["A", "a"]] });
    assert.deepStrictEqual(parser("A->a|b."), { productions: [["A", "a"], ["A", "b"]] });
    assert.deepStrictEqual(parser("A->."), { productions: [["A"]] });
  });

  it("symbols can contain numbers", function() {
    assert.deepStrictEqual(parser("A -> a1 ."), { productions: [["A", "a1"]] });
  });

  it("symbols can contain dollar and underscore", function() {
    assert.deepStrictEqual(parser("$ -> _ ."), { productions: [["$", "_"]] });
    assert.deepStrictEqual(parser("$a -> _1 a_2 ."), { productions: [["$a", "_1", "a_2"]] });
  });

  it("symbols can be quoted", function() {
    assert.deepStrictEqual(parser("\"A\" -> \"a\"."), { productions: [["A", "a"]] });
    assert.deepStrictEqual(parser("\"->\" -> ."), { productions: [["->"]] });
  });

  it("quoted symbols can contain escapes", function() {
    assert.deepStrictEqual(parser("\"\\\"\" -> ."), { productions: [["\\\""]] });
    assert.deepStrictEqual(parser("\"\\\\\" -> ."), { productions: [["\\\\"]] });
    assert.deepStrictEqual(parser("\"'\" -> ."), { productions: [["'"]] });
    assert.deepStrictEqual(parser("'\\'' -> ."), { productions: [["\\'"]] });
    assert.deepStrictEqual(parser("'\"' -> ."), { productions: [["\""]] });

    assert.deepStrictEqual(parser("\"\\b\" -> ."), { productions: [["\\b"]] });
    assert.deepStrictEqual(parser("\"\\f\" -> ."), { productions: [["\\f"]] });
    assert.deepStrictEqual(parser("\"\\n\" -> ."), { productions: [["\\n"]] });
    assert.deepStrictEqual(parser("\"\\r\" -> ."), { productions: [["\\r"]] });
    assert.deepStrictEqual(parser("\"\\t\" -> ."), { productions: [["\\t"]] });
    assert.deepStrictEqual(parser("\"\\v\" -> ."), { productions: [["\\v"]] });
    assert.deepStrictEqual(parser("\"\\0\" -> ."), { productions: [["\\0"]] });

    assert.deepStrictEqual(parser("\"\\xA9\" -> ."), { productions: [["\\xA9"]] });
    assert.deepStrictEqual(parser("\"\\xa9\" -> ."), { productions: [["\\xa9"]] });

    assert.deepStrictEqual(parser("\"\\u00A9\" -> ."), { productions: [["\\u00A9"]] });
    assert.deepStrictEqual(parser("\"\\u00a9\" -> ."), { productions: [["\\u00a9"]] });
    assert.deepStrictEqual(parser("\"\\u2665\" -> ."), { productions: [["\\u2665"]] });

    assert.deepStrictEqual(parser("\"\\u{1D306}\" -> ."), { productions: [["\\u{1D306}"]] });
  });

  it("nonterminals don't need to be capitalized", function() {
    assert.deepStrictEqual(parser("a -> b ."), { productions: [["a", "b"]] });
  });

  it("terminals can be capitalized", function() {
    assert.deepStrictEqual(parser("a -> B ."), { productions: [["a", "B"]] });
  });

  it("multiple lines", function() {
    assert.deepStrictEqual(parser("A -> a |\n  b\n  ."), { productions: [["A", "a"], ["A", "b"]] });
  });

  it("comments", function() {
    assert.deepStrictEqual(parser("# A -> a .\nA -> b ."), { productions: [["A", "b"]] });
    assert.deepStrictEqual(parser("# abc\n\nA -> b ."), { productions: [["A", "b"]] });
    assert.deepStrictEqual(parser("# 123\n\n"), { productions: [] });
  });

  describe("errors", function() {
    it("missing arrow", function() {
      assert.deepStrictEqual(parser("A -> a. B"), { error: new Error("Parse error") });
      assert.deepStrictEqual(parser("A"), { error: new Error("Parse error") });
    });

    it("missing nonterminal", function() {
      assert.deepStrictEqual(parser("A -> a. ->"), { error: new Error("Parse error") });
      assert.deepStrictEqual(parser("-> X"), { error: new Error("Parse error") });
    });

    it("multiple nonterminals", function() {
      assert.deepStrictEqual(parser("A B -> a."), { error: new Error("Parse error") });
    });

    it("stop that looks like part of a symbol", function() {
      assert.deepStrictEqual(parser("A.y -> a."), { error: new Error("Parse error") });
      assert.deepStrictEqual(parser("A -> x.y ."), { error: new Error("Parse error") });
    });

    it("rules can't mix definition styles", function() {
      assert.deepStrictEqual(parser("A -> a ;"), { error: new Error("Parse error") });
      assert.deepStrictEqual(parser("A : a ."), { error: new Error("Parse error") });
    });

    it("symbols can't start with a number", function() {
      assert.deepStrictEqual(parser("A -> 1 ."), { error: new Error("Parse error") });
    });

    it("quoted symbols can't contain a newline", function() {
      assert.deepStrictEqual(parser("\"A\n\" -> a ."), { error: new Error("Parse error") });
    });
  });
});
