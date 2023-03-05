function expand(grammar, production, symbol) {

  var i;

  var changes = [];

  // Remove the existing production

  changes.push({ operation: "delete", index: production });

  // Add new productions

  var offset = 0;

  for (i = 0; i < grammar.productions.length; i++) {

    if (grammar.productions[i][0] === grammar.productions[production][symbol]) {

      var p = grammar.productions[production].slice();
      var b = grammar.productions[i].slice(1);
      Array.prototype.splice.apply(p, [symbol, 1].concat(b));

      changes.push({ production: p, operation: "insert", index: production + offset });
      offset++;

    }

  }

  return changes;

}

export default function(grammar) {

  var i, j;

  var nonterminals = grammar.calculate("grammar.nonterminals");
  var result = [];

  // Are there any nonterminals we can expand?

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      if (nonterminals.has(grammar.productions[i][j])) {

        result.push({
          name: "expand",
          production: i,
          symbol: j,
          changes: expand(grammar, i, j)
        });

      }

    }
  }

  return result;

}
