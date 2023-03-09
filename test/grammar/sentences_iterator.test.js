import Grammar from "../../src/grammar/index.js";
import { makeSentencesIterator, takeFromIterator } from "../../src/grammar/sentences_iterator.js";
import assert from "node:assert/strict";

describe("makeSentencesIterator", function() {
  it("the return value can be used as an iterator", function() {
    let grammar = new Grammar([
      ["S", "a"],
      ["S", "b"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual([...iterator], [["a"], ["b"]]);
  });

  it("simple grammar", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: [], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["a", "b"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["a", "a", "b", "b"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
  });

  it("can be called multiple times for the same grammar and returns the same result", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);

    let iterator1 = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator1.next(), { value: [], done: false });
    assert.deepStrictEqual(iterator1.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator1.next(), { value: ["a", "b"], done: false });

    let iterator2 = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator2.next(), { value: [], done: false });
    assert.deepStrictEqual(iterator2.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator2.next(), { value: ["a", "b"], done: false });
  });

  it("multiple nonterminals and recursion", function() {
    let grammar = new Grammar([
      ["A", "y", "B"],
      ["A", "x"],
      ["A", "B", "C"],
      ["B", "z", "B"],
      ["B", "u"],
      ["C", "s"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: ["x"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["y", "u"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["y", "z", "u"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["u", "s"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["z", "u", "s"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["y", "z", "z", "u"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["y", "z", "z", "z", "u"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["z", "z", "u", "s"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
  });

  it("finite", function() {
    let grammar = new Grammar([
      ["A", "x"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: ["x"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: true });
  });

  it("repeated nonterminals and recursion (ambiguous)", function() {
    let grammar = new Grammar([
      ["a1", "x"],
      ["a1", "a2", "x", "a2"],
      ["a2", "a3", "x", "a3"],
      ["a3", "a1", "x", "a1"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: ["x"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"], done: false });
  });

  it("cycle", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: true });
  });

  it("optional cycle", function() {
    let grammar = new Grammar([
      ["A", "x"],
      ["A", "B"],
      ["B", "C"],
      ["C", "A"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: ["x"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["x"], done: false });
  });

  it("unreachable", function() {
    let grammar = new Grammar([
      ["A", "x"],
      ["B", "y"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: ["x"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: true });
  });

  it("unrealizable", function() {
    let grammar = new Grammar([
      ["A", "A", "x"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: true });
  });

  it("partially unrealizable", function() {
    let grammar = new Grammar([
      ["A", "B"],
      ["A", "x", "C"],
      ["A", "y", "A"],
      ["B", "C", "B"],
      ["C", "r"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["x", "r"], done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: undefined, done: false });
    assert.deepStrictEqual(iterator.next(), { value: ["y", "x", "r"], done: false });
  });
});

describe("takeFromIterator", function() {
  it("taking values has the expected result", function() {
    let iterator = [1, 2, 3, 4, 5].values();

    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [1, 2, 3], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [4, 5], done: true });
    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [], done: true });
  });

  it("doesn't return done if it's exactly at the end", function() {
    let iterator = [1, 2, 3].values();

    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [1, 2, 3], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [], done: true });
  });

  it("filters undefined values", function() {
    let iterator = [1, undefined, 3, undefined, 5].values();

    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [1, 3], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [5], done: true });
    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [], done: true });
  });

  it("produces an array for the last value even if it's empty", function() {
    let iterator = [1, undefined, 3, undefined].values();

    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [1, 3], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 3, 3), { values: [], done: true });
  });

  it("considers at least the number of values specified by limit", function() {
    let iterator = [1, undefined, 3, undefined, undefined, 6, undefined].values();

    assert.deepStrictEqual(takeFromIterator(iterator, 2, 3), { values: [1, 3], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 2, 3), { values: [6], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 2, 3), { values: [], done: true });
  });

  it("can be used with makeSentencesIterator", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);
    let iterator = makeSentencesIterator(grammar);

    assert.deepStrictEqual(takeFromIterator(iterator, 2, 3), { values: [[], ["a", "b"]], done: false });
    assert.deepStrictEqual(takeFromIterator(iterator, 2, 3), { values: [["a", "a", "b", "b"]], done: false });
  });
});
