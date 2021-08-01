const Grammar = require("../src/grammar");
const exampleFixtures = require("./fixtures/example_grammars.js");

const queueDepthFixtures = [
  `a1 -> x .
a1 -> a2 x a2 .
a2 -> a3 x a3 .
a3 -> a4 x a4 .
a4 -> a5 x a5 .
a5 -> a1 x a1 .`,
  `A -> A B | B .
B -> A | x .`
];

function check(spec) {
  it(spec, function() {
    let grammar = Grammar.parse(spec).grammar;
    grammar.calculate("grammar.sentences");
  });
}

describe("grammar.sentences", function() {
  queueDepthFixtures.forEach(check);

  for (let k in exampleFixtures) {
    check(exampleFixtures[k]);
  }
});
