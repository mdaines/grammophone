module.exports = function(grammar) {
  let nonterminals = grammar.calculate("grammar.nonterminals");

  let symbolCounts = new Map();
  let productionCounts = new Map();

  while (productionCounts.size < grammar.productions.length) {
    let size = productionCounts.size;

    for (let i = 0; i < grammar.productions.length; i++) {
      let steps = 1;

      let j;

      for (j = 1; j < grammar.productions[i].length; j++) {
        let s = grammar.productions[i][j];

        if (symbolCounts.has(s)) {
          steps += symbolCounts.get(s);
        } else if (nonterminals.has(s)) {
          break;
        }
      }

      if (j == grammar.productions[i].length) {
        let h = grammar.productions[i][0];

        if (!symbolCounts.has(h)) {
          symbolCounts.set(h, steps);
        }

        productionCounts.set(i, steps);
      }
    }

    if (size == productionCounts.size) {
      return undefined;
    }
  }

  let result = new Array(grammar.productions.length);

  for (let i = 0; i < grammar.productions.length; i++) {
    result[i] = productionCounts.get(i);
  }

  return result;
}
