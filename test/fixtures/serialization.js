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

function convertMap(m) {
  if (m instanceof Map) {
    return Array.from(m);
  } else {
    return m;
  }
}

export function prepare(calculationName, result) {
  result = convertRelation(result);
  result = convertSet(result);
  result = convertMap(result);

  if (calculationName === "grammar.symbolInfo") {
    result = {
      ...result,
      nonterminals: convertSet(result.nonterminals),
      terminals: convertSet(result.terminals)
    };
  }

  if (calculationName === "grammar.derivationSteps") {
    result = {
      ...result,
      productions: convertMap(result.productions),
      symbols: convertMap(result.symbols)
    };
  }

  return result;
}
