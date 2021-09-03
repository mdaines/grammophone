const parser = require("../src/parser");

describe("parser", function() {
  it("basics", function() {
    expect(parser("A -> a .")).toEqual([["A", "a"]]);
    expect(parser("A -> a | b .")).toEqual([["A", "a"], ["A", "b"]]);
    expect(parser("A -> .")).toEqual([["A"]]);
    expect(parser("A -> a. B -> b. A -> c.")).toEqual([["A", "a"], ["B", "b"], ["A", "c"]]);
  });

  it("colon and semicolon can be used to define rules", function() {
    expect(parser("A : a ;")).toEqual([["A", "a"]]);
    expect(parser("A : a | b ;")).toEqual([["A", "a"], ["A", "b"]]);
    expect(parser("A : ;")).toEqual([["A"]]);
    expect(parser("A : a; B : b; A : c;")).toEqual([["A", "a"], ["B", "b"], ["A", "c"]]);
  });

  it("spacing", function() {
    expect(parser("A->a.")).toEqual([["A", "a"]]);
    expect(parser("A->a|b.")).toEqual([["A", "a"], ["A", "b"]]);
    expect(parser("A->.")).toEqual([["A"]]);
  });

  it("symbols can contain numbers", function() {
    expect(parser("A -> a1 .")).toEqual([["A", "a1"]]);
  });

  it("symbols can contain dollar and underscore", function() {
    expect(parser("$ -> _ .")).toEqual([["$", "_"]]);
    expect(parser("$a -> _1 a_2 .")).toEqual([["$a", "_1", "a_2"]]);
  });

  it("nonterminals don't need to be capitalized", function() {
    expect(parser("a -> b .")).toEqual([["a", "b"]]);
  });

  it("terminals can be capitalized", function() {
    expect(parser("a -> B .")).toEqual([["a", "B"]]);
  });

  it("multiple lines", function() {
    expect(parser("A -> a |\n  b\n  .")).toEqual([["A", "a"], ["A", "b"]]);
  });

  it("comments", function() {
    expect(parser("# A -> a .\nA -> b .")).toEqual([["A", "b"]]);
    expect(parser("# abc\n\nA -> b .")).toEqual([["A", "b"]]);
    expect(parser("# 123\n\n")).toEqual([]);
  });

  describe("errors", function() {
    it("missing arrow", function() {
      expect(function() { parser("A -> a. B"); }).toThrowError();
      expect(function() { parser("A"); }).toThrowError();
    });

    it("missing nonterminal", function() {
      expect(function() { parser("A -> a. ->"); }).toThrowError();
      expect(function() { parser("-> X"); }).toThrowError();
    });

    it("multiple nonterminals", function() {
      expect(function() { parser("A B -> a."); }).toThrowError();
    });

    it("stop that looks like part of a symbol", function() {
      expect(function() { parser("A.y -> a."); }).toThrowError();
      expect(function() { parser("A -> x.y ."); }).toThrowError();
    });

    it("symbols cannot start with a number", function() {
      expect(function() { parser("A -> 1 ."); }).toThrowError();
    });
  });
});
