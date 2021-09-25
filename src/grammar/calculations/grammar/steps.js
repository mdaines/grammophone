module.exports = function(grammar) {
  let nonterminals = grammar.calculate("grammar.nonterminals");
  let unrealizable = grammar.calculate("grammar.unrealizable");

  let symbolCounts = new Map();
  let productionCounts = new Map();

  // symbolCounts[s] is undefined for any unrealizable s
  // if s is unrealizable, then for each production at index i containing s, productionCounts[i] is undefined

  for (let s of unrealizable) {
    symbolCounts.set(s, undefined);
  }

  for (let i = 0; i < grammar.productions.length; i++) {
    for (let j = 1; j < grammar.productions[i].length; j++) {
      let s = grammar.productions[i][j];

      if (unrealizable.has(s)) {
        productionCounts.set(i, undefined);
        break;
      }
    }
  }

  while (productionCounts.size < grammar.productions.length) {
    let size = productionCounts.size;

    for (let i = 0; i < grammar.productions.length; i++) {
      if (productionCounts.has(i)) {
        continue;
      }

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
  }

  return {
    symbols: symbolCounts,
    productions: productionCounts
  };
}
