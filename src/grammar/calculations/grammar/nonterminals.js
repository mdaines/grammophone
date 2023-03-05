export default function(grammar) {

  var i;
  var nonterminals = new Set();

  for (i = 0; i < grammar.productions.length; i++) {
    nonterminals.add(grammar.productions[i][0]);
  }

  return nonterminals;

}
