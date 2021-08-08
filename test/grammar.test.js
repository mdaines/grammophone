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
});
