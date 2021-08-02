module.exports = function(grammar) {

  var i;
  var nonterminals = {};

  for (i = 0; i < grammar.productions.length; i++) {
    nonterminals[grammar.productions[i][0]] = true;
  }

  return nonterminals;

};
