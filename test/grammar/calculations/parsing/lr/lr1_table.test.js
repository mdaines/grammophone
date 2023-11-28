import Grammar from "../../../../../src/grammar/index.js";
import { END } from "../../../../../src/grammar/symbols.js";
import assert from "node:assert/strict";

describe("lr1Table", function() {
  it("returns a parsing table", function() {
    const grammar = new Grammar([
      ["S", "a"]
    ]);

    assert.deepStrictEqual(grammar.calculations.lr1Table, [
      {
        "a": {
          "shift": 2
        },
        "S": {
          "shift": 1
        }
      },
      {
        [END]: {
          "reduce": [-1]
        }
      },
      {
        [END]: {
          "reduce": [0]
        }
      }
    ]);
  });
});
