const Grammar = require("../../src/grammar");
const makeSentencesIterator = require("../../src/grammar/make_sentences_iterator");

describe("sentencesIterator", function() {
  it("simple grammar", function() {
    let grammar = new Grammar([
      ["S", "a", "S", "b"],
      ["S"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    expect(iterator.next()).toEqual({ value: [], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["a", "b"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["a", "a", "b", "b"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
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
    expect(iterator.next()).toEqual({ value: ["x"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["y", "u"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["y", "z", "u"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["u", "s"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["z", "u", "s"], done: false });
    expect(iterator.next()).toEqual({ value: ["y", "z", "z", "u"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["y", "z", "z", "z", "u"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["z", "z", "u", "s"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
  });

  it("finite", function() {
    let grammar = new Grammar([
      ["A", "x"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    expect(iterator.next()).toEqual({ value: ["x"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: true });
  });

  it("repeated nonterminals and recursion", function() {
    let grammar = new Grammar([
      ["a1", "x"],
      ["a1", "a2", "x", "a2"],
      ["a2", "a3", "x", "a3"],
      ["a3", "a1", "x", "a1"]
    ]);

    let iterator = makeSentencesIterator(grammar);
    expect(iterator.next()).toEqual({ value: ["x"], done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: undefined, done: false });
    expect(iterator.next()).toEqual({ value: ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"], done: false });
  });
});
