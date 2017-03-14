'use strict';

module.exports["grammar.nullable"] = function(grammar) {

  const productions = grammar.calculate("grammar.productions");

  let nullable = {};
  let added;

  do {

    added = [];

    for (let i = 0; i < productions.length; i++) {
      
      let j;

      for (j = 1; j < productions[i].length; j++) {
        if (!nullable[productions[i][j]]) {
          break;
        }
      }

      let head = productions[i][0];

      if (j === productions[i].length && !nullable[head]) {
        nullable[head] = true;
        added.push(head);
      }

    }

  } while (added.length > 0);

  return nullable;

};
