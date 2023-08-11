import { getURLSearchParamSpec, DEFAULT_SPEC, encode, decode } from "../../src/app/spec_links.js";
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

  it("handles characters outside of ASCII range", function() {
    const search = "s=Iumfs+alvSIgLT4gIuKZqyIgIumfs+alvSIgfCAu";
    const expected = "\"音楽\" -> \"♫\" \"音楽\" | .";

    assert.deepStrictEqual(getURLSearchParamSpec(search), expected);
  });

  it("returns the default spec if the expected search param isn't present", function() {
    assert.deepStrictEqual(getURLSearchParamSpec(""), DEFAULT_SPEC);
  });
});

describe("encode", function() {
  it("returns the encoded version of the spec", function() {
    assert.deepStrictEqual(encode("A -> ."), "QSAtPiAu");
  });

  it("handles characters outside of ASCII range", function() {
    assert.deepStrictEqual(encode("\"音楽\" -> \"♫\" \"音楽\" | ."), "Iumfs-alvSIgLT4gIuKZqyIgIumfs-alvSIgfCAu");
  });

  it("uses base64url alphabet", function() {
    assert.deepStrictEqual(encode("??>>??"), "Pz8-Pj8_");
  });

  it("returns alternate padding", function() {
    assert.deepStrictEqual(encode("S -> Start $."), "UyAtPiBTdGFydCAkLg~~");
  });
});

describe("decode", function() {
  it("handles characters outside of ASCII range", function() {
    assert.deepStrictEqual(decode("Iumfs+alvSIgLT4gIuKZqyIgIumfs+alvSIgfCAu"), "\"音楽\" -> \"♫\" \"音楽\" | .");
  });

  it("handles regular base64", function() {
    assert.deepStrictEqual(decode("Pz8+Pj8/"), "??>>??");
  });

  it("handles base64url", function() {
    assert.deepStrictEqual(decode("Pz8-Pj8_"), "??>>??");
  });

  it("handles plus interpreted as space", function() {
    assert.deepStrictEqual(decode("Pz8 Pj8_"), "??>>??");
  });

  it("handles regular padding", function() {
    assert.deepStrictEqual(decode("UyAtPiBTdGFydCAkLg=="), "S -> Start $.");
  });

  it("handles alternate padding", function() {
    assert.deepStrictEqual(decode("UyAtPiBTdGFydCAkLg~~"), "S -> Start $.");
  });
});
