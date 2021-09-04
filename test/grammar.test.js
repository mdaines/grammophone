const Grammar = require("../src/grammar");

describe("Grammar", function() {
  describe("constructor", function() {
    it("validates productions", function() {
      expect(function() { new Grammar({ a: "1" }); }).toThrowError();
      expect(function() { new Grammar([{ a: "1" }]); }).toThrowError();
      expect(function() { new Grammar([[123]]); }).toThrowError();
      expect(function() { new Grammar([["A", "Grammar.END"]]); }).toThrowError();
      expect(function() { new Grammar([["A", ""]]); }).toThrowError();
      expect(function() { new Grammar([[]]); }).toThrowError();
      expect(function() { new Grammar([]); }).toThrowError();

      expect(function() { new Grammar([["A"]]); }).not.toThrowError();
      expect(function() { new Grammar([["A", "a"]]); }).not.toThrowError();
    });
  });

  describe("getNewSymbol", function() {
    it("returns a symbol not already in the grammar", function() {
      let grammar = new Grammar([["A", "a", "a2"], ["B2", "B3"]]);

      expect(grammar.getNewSymbol("A")).toEqual("A2");
      expect(grammar.getNewSymbol("a")).toEqual("a3");
      expect(grammar.getNewSymbol("a2")).toEqual("a3");
      expect(grammar.getNewSymbol("B2")).toEqual("B4");
      expect(grammar.getNewSymbol("B3")).toEqual("B4");
    });

    it("returns the same symbol if the symbol is not in the grammar", function() {
      let grammar = new Grammar([["A", "a"]]);

      expect(grammar.getNewSymbol("x")).toEqual("x");
    });
  });
});
