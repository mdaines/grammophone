import * as SetOperations from "../../../../src/set_operations.js";
import Grammar from "../../../../src/grammar/index.js";
import Fixtures from "../../../fixtures/example_grammars.js";
import assert from "node:assert/strict";

function classifications(calculations) {
  let result = new Set();

  for (let k in calculations.classification) {
    if (calculations.classification[k].member) {
      result.add(k);
    }
  }

  return result;
}

function assertExampleClassifications(expected, name) {
  const calculations = new Grammar(Fixtures[name]).calculations;

  // expected should be a subset of classifications
  assert.deepStrictEqual(SetOperations.intersection(expected, classifications(calculations)), expected);
}

describe("classification", function() {
  it("agrees with smlweb", function() {
    assertExampleClassifications(new Set(["lr0"]), "ll0-lr0-0.cfg");
    assertExampleClassifications(new Set(["lr0"]), "ll0-lr0-1.cfg");
    assertExampleClassifications(new Set(["lr0"]), "ll0-lr0-2.cfg");

    assertExampleClassifications(new Set(["ll1", "lr0"]), "ll1-lr0-0.cfg");
    assertExampleClassifications(new Set(["ll1", "lr0"]), "ll1-lr0-1.cfg");
    assertExampleClassifications(new Set(["ll1", "lr0"]), "ll1-lr0-2.cfg");

    assertExampleClassifications(new Set(["lr0"]), "ll2-lr0-0.cfg");
    assertExampleClassifications(new Set(["lr0"]), "ll2-lr0-1.cfg");
    assertExampleClassifications(new Set(["lr0"]), "ll2-lr0-2.cfg");

    assertExampleClassifications(new Set(["lr0"]), "oth-lr0-0.cfg");
    assertExampleClassifications(new Set(["lr0"]), "oth-lr0-1.cfg");
    assertExampleClassifications(new Set(["lr0"]), "oth-lr0-2.cfg");
    assertExampleClassifications(new Set(["lr0"]), "oth-lr0-3.cfg");

    assertExampleClassifications(new Set(["ll1", "slr1"]), "ll1-slr1-0.cfg");
    assertExampleClassifications(new Set(["ll1", "slr1"]), "ll1-slr1-1.cfg");
    assertExampleClassifications(new Set(["ll1", "slr1"]), "ll1-slr1-2.cfg");

    assertExampleClassifications(new Set(["slr1"]), "ll2-slr1-0.cfg");
    assertExampleClassifications(new Set(["slr1"]), "ll2-slr1-1.cfg");
    assertExampleClassifications(new Set(["slr1"]), "ll2-slr1-2.cfg");

    assertExampleClassifications(new Set(["slr1"]), "oth-slr1-0.cfg");
    assertExampleClassifications(new Set(["slr1"]), "oth-slr1-1.cfg");
    assertExampleClassifications(new Set(["slr1"]), "oth-slr1-2.cfg");

    assertExampleClassifications(new Set(["ll1", "lalr1"]), "ll1-lalr1-0.cfg");
    assertExampleClassifications(new Set(["ll1", "lalr1"]), "ll1-lalr1-1.cfg");
    assertExampleClassifications(new Set(["ll1", "lalr1"]), "ll1-lalr1-2.cfg");

    assertExampleClassifications(new Set(["lalr1"]), "ll2-lalr1-0.cfg");
    assertExampleClassifications(new Set(["lalr1"]), "ll2-lalr1-1.cfg");
    assertExampleClassifications(new Set(["lalr1"]), "ll2-lalr1-2.cfg");

    assertExampleClassifications(new Set(["lalr1"]), "oth-lalr1-0.cfg");
    assertExampleClassifications(new Set(["lalr1"]), "oth-lalr1-1.cfg");
    assertExampleClassifications(new Set(["lalr1"]), "oth-lalr1-2.cfg");
    assertExampleClassifications(new Set(["lalr1"]), "oth-lalr1-3.cfg");

    assertExampleClassifications(new Set(["ll1", "lr1"]), "ll1-lr1-0.cfg");
    assertExampleClassifications(new Set(["ll1", "lr1"]), "ll1-lr1-1.cfg");
    assertExampleClassifications(new Set(["ll1", "lr1"]), "ll1-lr1-2.cfg");

    assertExampleClassifications(new Set(["lr1"]), "ll2-lr1-0.cfg");
    assertExampleClassifications(new Set(["lr1"]), "ll2-lr1-1.cfg");
    assertExampleClassifications(new Set(["lr1"]), "ll2-lr1-2.cfg");

    assertExampleClassifications(new Set(["lr1"]), "oth-lr1-0.cfg");
    assertExampleClassifications(new Set(["lr1"]), "oth-lr1-1.cfg");
    assertExampleClassifications(new Set(["lr1"]), "oth-lr1-2.cfg");

    assertExampleClassifications(new Set(), "ll2-lr2-0.cfg");
    assertExampleClassifications(new Set(), "ll2-lr2-1.cfg");
    assertExampleClassifications(new Set(), "ll2-lr2-2.cfg");
    assertExampleClassifications(new Set(), "ll2-lr2-3.cfg");
    assertExampleClassifications(new Set(), "ll2-lr2-4.cfg");

    assertExampleClassifications(new Set(), "oth-lr2-0.cfg");
    assertExampleClassifications(new Set(), "oth-lr2-1.cfg");
    assertExampleClassifications(new Set(), "oth-lr2-2.cfg");

    assertExampleClassifications(new Set(), "oth-oth-0.cfg");
    assertExampleClassifications(new Set(), "oth-oth-1.cfg");
    assertExampleClassifications(new Set(), "oth-oth-2.cfg");
    assertExampleClassifications(new Set(), "oth-oth-3.cfg");
    assertExampleClassifications(new Set(), "oth-oth-4.cfg");
    assertExampleClassifications(new Set(), "oth-oth-5.cfg");

    assertExampleClassifications(new Set(), "issue-41");
  });
});
