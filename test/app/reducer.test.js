import { reducer, init } from "../../src/app/reducer.js";
import Grammar from "../../src/grammar/index.js"
import assert from "node:assert/strict";

describe("reducer", function() {
  describe("init", function() {
    it("returns the expected state with no argument", function() {
      assert.deepStrictEqual(init(), { spec: "", mode: "edit", grammar: undefined, error: undefined });
    });

    it("returns the expected state with a valid grammar spec", function() {
      assert.deepStrictEqual(init("A -> ."), { spec: "A -> .", mode: "edit", grammar: new Grammar([["A"]]), error: undefined });
    });

    it("returns the expected state with an invalid grammar spec", function() {
      assert.deepStrictEqual(init("invalid!"), { spec: "invalid!", mode: "edit", error: new Error("Parse error") });
    });

    it("returns the expected state with a semantically invalid grammar spec", function() {
      assert.deepStrictEqual(init("A -> \"\"."), { spec: "A -> \"\".", mode: "edit", error: new Error("An empty symbol may not be part of a production") });
    });
  });

  describe("reducer", function() {
    describe("analyze", function() {
      it("leaves the grammar untouched if a parse error is introduced", function() {
        let state = init("A -> .");

        state = reducer(state, { type: "setSpec", spec: "invalid!" });
        state = reducer(state, { type: "analyze" });

        assert.deepStrictEqual(state, { spec: "invalid!", mode: "edit", grammar: new Grammar([["A"]]), error: new Error("Parse error") });
      });

      it("clears a previously-defined error if the spec doesn't have a parse error", function() {
        let state = init("invalid!");

        state = reducer(state, { type: "setSpec", spec: "A -> ." });
        state = reducer(state, { type: "analyze" });

        assert.deepStrictEqual(state, { spec: "A -> .", mode: "edit", grammar: new Grammar([["A"]]), error: undefined });
      });

      it("clears the grammar without errors if the spec is blank", function() {
        let state = init("A -> .");

        state = reducer(state, { type: "setSpec", spec: "" });
        state = reducer(state, { type: "analyze" });

        assert.deepStrictEqual(state, { spec: "", mode: "edit", grammar: undefined, error: undefined });
      });
    });

    describe("edit", function() {
      it("clears the transform state", function() {
        let state = init("A -> .");

        state = reducer(state, { type: "transform" });
        state = reducer(state, { type: "edit" });

        assert.deepStrictEqual(state, {
          spec: "A -> .",
          mode: "edit",
          grammar: new Grammar([["A"]]),
          error: undefined,
          transformStack: undefined,
          transformIndex: undefined
        });
      });
    });

    describe("transform", function() {
      it("transitions to the transform mode", function() {
        let state = init("A -> .");

        state = reducer(state, { type: "transform" });

        assert.deepStrictEqual(state, {
          spec: "A -> .",
          mode: "transform",
          grammar: new Grammar([["A"]]),
          error: undefined,
          transformStack: [
            { grammar: new Grammar([["A"]]) }
          ],
          transformIndex: 0
        });
      });

      it("doesn't transition to the transform mode if the spec is invalid", function() {
        let state = init("invalid!");

        state = reducer(state, { type: "transform" });

        assert.deepStrictEqual(state, { spec: "invalid!", mode: "edit", grammar: undefined, error: new Error("Parse error") });
      });

      it("doesn't transition to the transform mode if the spec is blank", function() {
        let state = init("");

        state = reducer(state, { type: "transform" });

        assert.deepStrictEqual(state, { spec: "", mode: "edit", grammar: undefined, error: undefined });
      });
    });

    describe("unhandled action type", function() {
      it("throws for an unhandled action type", function() {
        let state = init("");

        assert.throws(function() { reducer(state, { type: "unhandled!" }); });
      });
    });
  });
});
