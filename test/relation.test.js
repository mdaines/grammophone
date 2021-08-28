const Relation = require("../src/relation");

describe("get", function() {
  it("returns added sets", function() {
    let relation = new Relation();
    relation.add("x", "y");
    relation.add("x", "z");
    relation.add("a", "b");

    expect(relation.get("x")).toEqual(new Set(["y", "z"]));
    expect(relation.get("a")).toEqual(new Set(["b"]));
  });

  it("returns the empty set when nothing has been added", function() {
    let relation = new Relation();
    relation.add("x", "y");

    expect(relation.get("a")).toEqual(new Set());
  });
});

describe("keys", function() {
  it("returns something that can be used to iterate over the domain in insertion order", function() {
    let relation = new Relation();
    relation.add("x", "a");
    relation.add("y", "b");

    expect(Array.from(relation.keys())).toEqual(["x", "y"]);
  });
});

describe("has", function() {
  it("returns a boolean indicating whether the pair is in the relation", function() {
    let relation = new Relation();
    relation.add("x", "a");
    relation.add("y", "b");

    expect(relation.has("x", "a")).toEqual(true);
    expect(relation.has("y", "b")).toEqual(true);

    expect(relation.has("x", "b")).toEqual(false);
    expect(relation.has("z", "c")).toEqual(false);
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

    expect(closure.has("x", "y")).toEqual(true);
    expect(closure.has("x", "z")).toEqual(true);
    expect(closure.has("x", "x")).toEqual(true);
    expect(closure.has("y", "z")).toEqual(true);
    expect(closure.has("y", "x")).toEqual(true);
    expect(closure.has("z", "x")).toEqual(true);
    expect(closure.has("z", "y")).toEqual(true);
    expect(closure.has("z", "z")).toEqual(true);
    expect(closure.has("a", "b")).toEqual(true);
  });
});

describe("iteration", function() {
  it("is iterable", function() {
    let relation = new Relation();
    relation.add("x", "y");
    relation.add("y", "z");

    expect(Array.from(relation)).toEqual([["x", "y"], ["y", "z"]]);
  });
});

describe("entries", function() {
  it("returns something that can be used to iterate over the pairs in the relation", function() {
    let relation = new Relation();
    relation.add("x", "a");
    relation.add("x", "b");
    relation.add("y", "c");

    expect(Array.from(relation.entries())).toEqual([["x", "a"], ["x", "b"], ["y", "c"]]);
  });
});
