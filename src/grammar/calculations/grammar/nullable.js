'use strict';

module.exports["grammar.nullable"] = function(grammar) {

  let nullable = {};
  let added;

  do {

    added = [];

    for (let i = 0; i < grammar.productions.length; i++) {
      
      let j;

      for (j = 1; j < grammar.productions[i].length; j++) {
        if (!nullable[grammar.productions[i][j]]) {
          break;
        }
      }

      let head = grammar.productions[i][0];

      if (j === grammar.productions[i].length && !nullable[head]) {
        nullable[head] = true;
        added.push(head);
      }

    }

  } while (added.length > 0);

  return nullable;

};
