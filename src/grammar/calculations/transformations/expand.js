function expand(productions, production, symbol) {

  var i;

  var changes = [];

  // Remove the existing production

  changes.push({ operation: "delete", index: production });

  // Add new productions

  var offset = 0;

  for (i = 0; i < productions.length; i++) {

    if (productions[i][0] === productions[production][symbol]) {

      var p = productions[production].slice();
      var b = productions[i].slice(1);
      Array.prototype.splice.apply(p, [symbol, 1].concat(b));

      changes.push({ production: p, operation: "insert", index: production + offset });
      offset++;

    }

  }

  return changes;

}

export default function({ productions, nonterminals }) {

  var i, j;

  var result = [];

  // Are there any nonterminals we can expand?

  for (i = 0; i < productions.length; i++) {
    for (j = 1; j < productions[i].length; j++) {

      if (nonterminals.has(productions[i][j])) {

        result.push({
          name: "expand",
          production: i,
          symbol: j,
          changes: expand(productions, i, j)
        });

      }

    }
  }

  return result;

}
