import { quoteSymbol } from "../../src/grammar/symbols.js";
import assert from "node:assert/strict";

describe("quoteSymbol", function() {
  it("quotes symbols if necessary", function() {
    assert.strictEqual(quoteSymbol("A"), "A");
    assert.strictEqual(quoteSymbol("_a2"), "_a2");
    assert.strictEqual(quoteSymbol("$a"), "$a");
    assert.strictEqual(quoteSymbol("あ"), `"あ"`);
    assert.strictEqual(quoteSymbol("\n"), `"\\n"`);
    assert.strictEqual(quoteSymbol("\0"), `"\\u0000"`);
    assert.strictEqual(quoteSymbol("©"), `"©"`);
  });
});
