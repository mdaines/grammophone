export default function({ productions, nonterminals, unrealizable }) {
  let symbolCounts = new Map();
  let productionCounts = new Map();

  // symbolCounts[s] is undefined for any unrealizable s
  // if s is unrealizable, then for each production at index i containing s, productionCounts[i] is undefined

  for (let s of unrealizable) {
    symbolCounts.set(s, undefined);
  }

  for (let i = 0; i < productions.length; i++) {
    for (let j = 1; j < productions[i].length; j++) {
      let s = productions[i][j];

      if (unrealizable.has(s)) {
        productionCounts.set(i, undefined);
        break;
      }
    }
  }

  while (productionCounts.size < productions.length) {
    for (let i = 0; i < productions.length; i++) {
      if (productionCounts.has(i)) {
        continue;
      }

      let steps = 1;

      let j;

      for (j = 1; j < productions[i].length; j++) {
        let s = productions[i][j];

        if (symbolCounts.has(s)) {
          steps += symbolCounts.get(s);
        } else if (nonterminals.has(s)) {
          break;
        }
      }

      if (j == productions[i].length) {
        let h = productions[i][0];

        if (!symbolCounts.has(h)) {
          symbolCounts.set(h, steps);
        }

        productionCounts.set(i, steps);
      }
    }
  }

  for (let s of symbolCounts.keys()) {
    if (typeof symbolCounts.get(s) == "undefined") {
      symbolCounts.delete(s);
    }
  }

  for (let i of productionCounts.keys()) {
    if (typeof productionCounts.get(i) == "undefined") {
      productionCounts.delete(i);
    }
  }

  return {
    symbols: symbolCounts,
    productions: productionCounts
  };
}
