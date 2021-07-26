const Grammar = require("../src/index");
const Set = require("../src/set");
const EXAMPLE_GRAMMARS = require("./fixtures/example_grammars.js");

function parse(spec) {

  return Grammar.parse(spec).grammar;

}

function classifications(grammar) {

  var classification = grammar.calculate("grammar.classification");
  var k, result;

  result = {};

  for (k in classification) {
    if (classification[k].member)
      result[k] = true;
  }

  return result;

}

function isSetEqual(a, b) {

  return Set.count(Set.intersection(a, b)) === Set.count(a);

}

var SUPPORTED_CLASSIFICATIONS = {
  ll1: true, lr0: true, slr1: true,
  lr1: true, lr1: true, lalr1: true
}

function assertExampleClassifications(expected, name) {

  var actual = Set.intersection(classifications(parse(EXAMPLE_GRAMMARS[name])), SUPPORTED_CLASSIFICATIONS);

  expect(isSetEqual(expected, actual)).toBe(true);

}

describe("GrammarClassificationTest", function() {

  it("testAgreement", function() {

    assertExampleClassifications({ "lr0": true }, "ll0-lr0-0.cfg");
    assertExampleClassifications({ "lr0": true }, "ll0-lr0-1.cfg");
    assertExampleClassifications({ "lr0": true }, "ll0-lr0-2.cfg");

    assertExampleClassifications({ "ll1": true, "lr0": true }, "ll1-lr0-0.cfg");
    assertExampleClassifications({ "ll1": true, "lr0": true }, "ll1-lr0-1.cfg");
    assertExampleClassifications({ "ll1": true, "lr0": true }, "ll1-lr0-2.cfg");

    assertExampleClassifications({ "lr0": true }, "ll2-lr0-0.cfg");
    assertExampleClassifications({ "lr0": true }, "ll2-lr0-1.cfg");
    assertExampleClassifications({ "lr0": true }, "ll2-lr0-2.cfg");

    assertExampleClassifications({ "lr0": true }, "oth-lr0-0.cfg");
    assertExampleClassifications({ "lr0": true }, "oth-lr0-1.cfg");
    assertExampleClassifications({ "lr0": true }, "oth-lr0-2.cfg");
    assertExampleClassifications({ "lr0": true }, "oth-lr0-3.cfg");

    assertExampleClassifications({ "ll1": true, "slr1": true }, "ll1-slr1-0.cfg");
    assertExampleClassifications({ "ll1": true, "slr1": true }, "ll1-slr1-1.cfg");
    assertExampleClassifications({ "ll1": true, "slr1": true }, "ll1-slr1-2.cfg");

    assertExampleClassifications({ "slr1": true }, "ll2-slr1-0.cfg");
    assertExampleClassifications({ "slr1": true }, "ll2-slr1-1.cfg");
    assertExampleClassifications({ "slr1": true }, "ll2-slr1-2.cfg");

    assertExampleClassifications({ "slr1": true }, "oth-slr1-0.cfg");
    assertExampleClassifications({ "slr1": true }, "oth-slr1-1.cfg");
    assertExampleClassifications({ "slr1": true }, "oth-slr1-2.cfg");

    assertExampleClassifications({ "ll1": true, "lalr1": true }, "ll1-lalr1-0.cfg");
    assertExampleClassifications({ "ll1": true, "lalr1": true }, "ll1-lalr1-1.cfg");
    assertExampleClassifications({ "ll1": true, "lalr1": true }, "ll1-lalr1-2.cfg");

    assertExampleClassifications({ "lalr1": true }, "ll2-lalr1-0.cfg");
    assertExampleClassifications({ "lalr1": true }, "ll2-lalr1-1.cfg");
    assertExampleClassifications({ "lalr1": true }, "ll2-lalr1-2.cfg");

    assertExampleClassifications({ "lalr1": true }, "oth-lalr1-0.cfg");
    assertExampleClassifications({ "lalr1": true }, "oth-lalr1-1.cfg");
    assertExampleClassifications({ "lalr1": true }, "oth-lalr1-2.cfg");
    assertExampleClassifications({ "lalr1": true }, "oth-lalr1-3.cfg");

    assertExampleClassifications({ "ll1": true, "lr1": true }, "ll1-lr1-0.cfg");
    assertExampleClassifications({ "ll1": true, "lr1": true }, "ll1-lr1-1.cfg");
    assertExampleClassifications({ "ll1": true, "lr1": true }, "ll1-lr1-2.cfg");

    assertExampleClassifications({ "lr1": true }, "ll2-lr1-0.cfg");
    assertExampleClassifications({ "lr1": true }, "ll2-lr1-1.cfg");
    assertExampleClassifications({ "lr1": true }, "ll2-lr1-2.cfg");

    assertExampleClassifications({ "lr1": true }, "oth-lr1-0.cfg");
    assertExampleClassifications({ "lr1": true }, "oth-lr1-1.cfg");
    assertExampleClassifications({ "lr1": true }, "oth-lr1-2.cfg");

    assertExampleClassifications({ }, "ll2-lr2-0.cfg");
    assertExampleClassifications({ }, "ll2-lr2-1.cfg");
    assertExampleClassifications({ }, "ll2-lr2-2.cfg");
    assertExampleClassifications({ }, "ll2-lr2-3.cfg");
    assertExampleClassifications({ }, "ll2-lr2-4.cfg");

    assertExampleClassifications({ }, "oth-lr2-0.cfg");
    assertExampleClassifications({ }, "oth-lr2-1.cfg");
    assertExampleClassifications({ }, "oth-lr2-2.cfg");

    assertExampleClassifications({ }, "oth-oth-0.cfg");
    assertExampleClassifications({ }, "oth-oth-1.cfg");
    assertExampleClassifications({ }, "oth-oth-2.cfg");
    assertExampleClassifications({ }, "oth-oth-3.cfg");
    assertExampleClassifications({ }, "oth-oth-4.cfg");
    assertExampleClassifications({ }, "oth-oth-5.cfg");

  });

});
