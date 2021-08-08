const parser = require("../src/parser");

describe("parser", function() {
  it("basics", function() {
    expect(parser("A -> a .")).toEqual([["A", "a"]]);
    expect(parser("A -> a | b .")).toEqual([["A", "a"], ["A", "b"]]);
    expect(parser("A -> .")).toEqual([["A"]]);
    expect(parser("A -> a. B -> b. A -> c.")).toEqual([["A", "a"], ["B", "b"], ["A", "c"]]);
  });

  it("spacing", function() {
    expect(parser("A->a.")).toEqual([["A", "a"]]);
    expect(parser("A->a|b.")).toEqual([["A", "a"], ["A", "b"]]);
    expect(parser("A->.")).toEqual([["A"]]);
  });

  it("other characters", function() {
    // expect(parser("A -> x - > y.")).toEqual([["A", "x", "-", ">", "y"]]);
    expect(parser("A' -> a. A'' -> a.")).toEqual([["A'", "a"], ["A''", "a"]]);
    // expect(parser("A -> something-something.")).toEqual([["A", "something-something"]]);
    // expect(parser("-->-.")).toEqual([["-", "-"]]);
    // expect(parser("A -> 1 | 2 | 3.")).toEqual([["A", "1"], ["A", "2"], ["A", "3"]]);
    // expect(parser("A -> \" \'.")).toEqual([["A", "\"", "'"]]);
    // expect(parser("A -> \"a \".")).toEqual([["A", "\"a", "\""]]);
  });

  it("multiple lines", function() {
    expect(parser("A -> a |\n  b\n  .")).toEqual([["A", "a"], ["A", "b"]]);
  });

  it("comments", function() {
    expect(parser("# A -> a .\nA -> b .")).toEqual([["A", "b"]]);
    expect(parser("# abc\n\nA -> b .")).toEqual([["A", "b"]]);
    expect(parser("# 123\n\n")).toEqual([]);
  });

  it("errors", function() {
    expect(function() { parser("A -> a. B"); }).toThrowError();
    expect(function() { parser("A B -> a."); }).toThrowError();
    expect(function() { parser("A -> a. ->"); }).toThrowError();
    expect(function() { parser("-> X"); }).toThrowError();
    expect(function() { parser("A"); }).toThrowError();
    expect(function() { parser("A.y -> a."); }).toThrowError();
    expect(function() { parser("A -> x.y ."); }).toThrowError();
  });
});
