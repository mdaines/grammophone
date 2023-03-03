const { formatSymbol, bareFormatSymbol } = require("../src/components/helpers.js");
const END = require("../src/grammar/symbols").END;

describe("helpers", function() {
  describe("formatSymbol", function() {
    it("formats END as $", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      expect(formatSymbol(END, info)).toEqual("something");

      // let output = mq(helpers.formatSymbol(END, info));
      // expect(output.has("u")).toBe(true);
      // expect(output.contains("$")).toBe(true);
    });

    it("formats whitespace characters", function() {
      let info = {
        terminals: new Set([" "]),
        nonterminals: new Set()
      };

      expect(formatSymbol(" ", info)).toEqual("something");

      // let output = mq(helpers.formatSymbol(" ", info));
      // expect(output.has("b")).toBe(true);
      // expect(output.contains("\u2B1A")).toBe(true);
    });

    it("refuses to format an unknown symbol", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      expect(function() { formatSymbol("x", info); }).toThrowError();
    });
  });

  describe("bareFormatSymbol", function() {
    it("formats END as $", function() {
      expect(bareFormatSymbol(END, {})).toEqual("$");
    });

    it("escapes HTML", function() {
      let info = {
        terminals: new Set(["&"]),
        nonterminals: new Set()
      };

      expect(bareFormatSymbol("&", info)).toEqual("&amp;");
    });

    it("formats whitespace characters", function() {
      let info = {
        terminals: new Set([" "]),
        nonterminals: new Set()
      };

      expect(bareFormatSymbol(" ", info)).toEqual("\u2B1A");
    });

    it("refuses to format an unknown symbol", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      expect(function() { bareFormatSymbol("x", info); }).toThrowError();
    });
  });
});
