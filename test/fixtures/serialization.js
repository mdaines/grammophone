function convertSet(s) {
  if (s instanceof Set) {
    return Array.from(s);
  } else {
    return s;
  }
}

function prepare(calculationName, result) {
  result = convertSet(result);

  if (calculationName === "grammar.symbolInfo") {
    result.nonterminals = convertSet(result.nonterminals);
    result.terminals = convertSet(result.terminals);
  }

  return result;
}

module.exports.prepare = prepare;
