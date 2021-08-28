var Relation = require('../../../relation');

module.exports = function(grammar) {

  var immediate, propagation, result;
  var i, j;
  var nullable = grammar.calculate("grammar.nullable");
  var nonterminals = grammar.calculate("grammar.nonterminals");

  immediate = new Relation();
  propagation = new Relation();

  // For each production, add the first terminal symbol after a sequence of nullable symbols.

  for (i = 0; i < grammar.productions.length; i++) {

    // Skip nullable symbols...

    for (j = 1; j < grammar.productions[i].length; j++) {

      if (!nullable.has(grammar.productions[i][j])) {
        break;
      }

    }

    // If the first non-nullable symbol is a terminal, add it to the immediate first set
    // of this nonterminal.

    if (j < grammar.productions[i].length && !nonterminals.has(grammar.productions[i][j])) {
      immediate.add(grammar.productions[i][0], grammar.productions[i][j]);
    }

  }

  // For each production, add the prefix of nullable nonterminals, and then the next symbol
  // if it is also a nonterminal.

  for (i = 0; i < grammar.productions.length; i++) {
    for (j = 1; j < grammar.productions[i].length; j++) {

      // Is it a nonterminal? Add it.

      if (nonterminals.has(grammar.productions[i][j])) {
        propagation.add(grammar.productions[i][0], grammar.productions[i][j]);
      }

      // Is it not nullable? Stop.

      if (!nullable.has(grammar.productions[i][j])) {
        break;
      }

    }
  }

  // Propagate the relation.

  result = immediate.propagate(propagation);

  return result;

};
