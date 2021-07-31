const Grammar = require("../src/grammar");

describe("grammar.sentences", function() {
  it("queue depth limit works", function() {
    let spec = `
    a1 -> x .
    a1 -> a2 x a2 .
    a2 -> a3 x a3 .
    a3 -> a4 x a4 .
    a4 -> a5 x a5 .
    a5 -> a1 x a1 .
    `;

    let grammar = Grammar.parse(spec).grammar;
    grammar.calculate("grammar.sentences");
  });
});
