module.exports = function(grammar) {
  let symbols = new Set();

  for (let i = 0; i < grammar.productions.length; i++) {
    for (let j = 0; j < grammar.productions[i].length; j++) {
      symbols.add(grammar.productions[i][j]);
    }
  }

  return symbols;
};
