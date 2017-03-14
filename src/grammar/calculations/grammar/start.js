'use strict';

module.exports["grammar.start"] = function(grammar) {
  
  const productions = grammar.calculate("grammar.productions");

  return productions[0][0];

};
