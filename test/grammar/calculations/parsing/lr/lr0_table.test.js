import Grammar from "../../../../../src/grammar/index.js";
import { END } from "../../../../../src/grammar/symbols.js";
import assert from "node:assert/strict";

describe("lr0Table", function() {
  it("returns a parsing table", function() {
    const grammar = new Grammar([
      ["S", "a"]
    ]);

    assert.deepStrictEqual(grammar.calculations.lr0Table, [
      {
        "a": {
          "shift": 2
        },
        "S": {
          "shift": 1
        }
      },
      {
        "a": {
          "reduce": [-1]
        },
        [END]: {
          "reduce": [-1]
        }
      },
      {
        "a": {
          "reduce": [0]
        },
        [END]: {
          "reduce": [0]
        }
      }
    ]);
  });
});
