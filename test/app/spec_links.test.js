import { getURLSearchParamSpec } from "../../src/app/spec_links.js";
import assert from "node:assert/strict";

describe("getURLSearchParamSpec", function() {
  it("returns the expected spec", function() {
    const search = "s=UyAtPiBhIFMgYiAuClMgLT4gLgo=";
    const expected = "S -> a S b .\nS -> .\n";

    assert.deepStrictEqual(getURLSearchParamSpec(search), expected);
  });

  it("returns the expected spec for a search param with a plus sign", function() {
    const search = "s=UyAtPiBTdGFydCAkLgpTdGFydCAtPiBUeXBlIE5hbWUuClN0YXJ0IC0+IE5hbWUuClR5cGUgLT4gaWQgIjwiLgpOYW1lIC0+IGlkICI8Ii4=";
    const expected = "S -> Start $.\nStart -> Type Name.\nStart -> Name.\nType -> id \"<\".\nName -> id \"<\".";

    assert.deepStrictEqual(getURLSearchParamSpec(search), expected);
  });
});
