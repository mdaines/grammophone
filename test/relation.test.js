import Relation from "../src/relation.js";
import assert from "node:assert/strict";

describe("Relation", function() {
  describe("get", function() {
    it("returns added sets", function() {
      let relation = new Relation();
      relation.add("x", "y");
      relation.add("x", "z");
      relation.add("a", "b");

      assert.deepStrictEqual(relation.get("x"), new Set(["y", "z"]));
      assert.deepStrictEqual(relation.get("a"), new Set(["b"]));
    });

    it("returns the empty set when nothing has been added", function() {
      let relation = new Relation();
      relation.add("x", "y");

      assert.deepStrictEqual(relation.get("a"), new Set());
    });
  });

  describe("keys", function() {
    it("returns something that can be used to iterate over the domain in insertion order", function() {
      let relation = new Relation();
      relation.add("x", "a");
      relation.add("y", "b");

      assert.deepStrictEqual(Array.from(relation.keys()), ["x", "y"]);
    });
  });

  describe("has", function() {
    it("returns a boolean indicating whether the pair is in the relation", function() {
      let relation = new Relation();
      relation.add("x", "a");
      relation.add("y", "b");

      assert.deepStrictEqual(relation.has("x", "a"), true);
      assert.deepStrictEqual(relation.has("y", "b"), true);

      assert.deepStrictEqual(relation.has("x", "b"), false);
      assert.deepStrictEqual(relation.has("z", "c"), false);
    });
  });

  describe("closure", function() {
    it("returns the closure of the relation", function() {
      let relation = new Relation();
      relation.add("x", "y");
      relation.add("y", "z");
      relation.add("z", "x");
      relation.add("a", "b");

      let closure = relation.closure();

      assert.deepStrictEqual(closure.has("x", "y"), true);
      assert.deepStrictEqual(closure.has("x", "z"), true);
      assert.deepStrictEqual(closure.has("x", "x"), true);
      assert.deepStrictEqual(closure.has("y", "z"), true);
      assert.deepStrictEqual(closure.has("y", "x"), true);
      assert.deepStrictEqual(closure.has("z", "x"), true);
      assert.deepStrictEqual(closure.has("z", "y"), true);
      assert.deepStrictEqual(closure.has("z", "z"), true);
      assert.deepStrictEqual(closure.has("a", "b"), true);
    });
  });

  describe("iteration", function() {
    it("is iterable", function() {
      let relation = new Relation();
      relation.add("x", "y");
      relation.add("y", "z");

      assert.deepStrictEqual(Array.from(relation), [["x", "y"], ["y", "z"]]);
    });
  });

  describe("entries", function() {
    it("returns something that can be used to iterate over the pairs in the relation", function() {
      let relation = new Relation();
      relation.add("x", "a");
      relation.add("x", "b");
      relation.add("y", "c");

      assert.deepStrictEqual(Array.from(relation.entries()), [["x", "a"], ["x", "b"], ["y", "c"]]);
    });
  });

  describe("graph", function() {
    it("returns a representation of the relation as a graph", function() {
      let relation = new Relation();
      relation.add("x", "y");
      relation.add("y", "z");
      relation.add("z", "x");
      relation.add("a", "b");

      assert.deepStrictEqual(relation.graph(), {
        data: {},
        nodes: [],
        edges: [
          { source: "x", target: "y", data: {} },
          { source: "y", target: "z", data: {} },
          { source: "z", target: "x", data: {} },
          { source: "a", target: "b", data: {} }
        ]
      });
    });
  });
});
