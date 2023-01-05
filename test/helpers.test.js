const mq = require("mithril-query");
const helpers = require("../src/helpers");
const END = require("../src/grammar/symbols").END;

describe("helpers", function() {
  describe("formatSymbol", function() {
    it("formats END as $", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      let output = mq(helpers.formatSymbol(END, info));
      expect(output.has("u")).toBe(true);
      expect(output.contains("$")).toBe(true);
    });

    it("formats whitespace characters", function() {
      let info = {
        terminals: new Set([" "]),
        nonterminals: new Set()
      };

      let output = mq(helpers.formatSymbol(" ", info));
      expect(output.has("b")).toBe(true);
      expect(output.contains("\u2B1A")).toBe(true);
    });

    it("refuses to format an unknown symbol", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      expect(function() { helpers.formatSymbol("x", info); }).toThrowError();
    });
  });

  describe("bareFormatSymbol", function() {
    it("formats END as $", function() {
      expect(helpers.bareFormatSymbol(END, {})).toEqual("$");
    });

    it("escapes HTML", function() {
      let info = {
        terminals: new Set(["&"]),
        nonterminals: new Set()
      };

      expect(helpers.bareFormatSymbol("&", info)).toEqual("&amp;");
    });

    it("formats whitespace characters", function() {
      let info = {
        terminals: new Set([" "]),
        nonterminals: new Set()
      };

      expect(helpers.bareFormatSymbol(" ", info)).toEqual("\u2B1A");
    });

    it("refuses to format an unknown symbol", function() {
      let info = {
        terminals: new Set(),
        nonterminals: new Set()
      };

      expect(function() { helpers.bareFormatSymbol("x", info); }).toThrowError();
    });
  });
});
