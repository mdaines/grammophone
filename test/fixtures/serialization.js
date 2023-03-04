import Relation from "../../src/relation.js";

function convertSet(s) {
  if (s instanceof Set) {
    return Array.from(s);
  } else {
    return s;
  }
}

function convertRelation(r) {
  if (r instanceof Relation) {
    return Array.from(r.entries());
  } else {
    return r;
  }
}

export function prepare(calculationName, result) {
  result = convertRelation(result);
  result = convertSet(result);

  if (calculationName === "grammar.symbolInfo") {
    result.nonterminals = convertSet(result.nonterminals);
    result.terminals = convertSet(result.terminals);
  }

  return result;
}
