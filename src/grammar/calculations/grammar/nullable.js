module.exports = function(grammar) {

  var nullable = {};
  var added;
  var i, j, head;

  do {

    added = [];

    for (i = 0; i < grammar.productions.length; i++) {

      for (j = 1; j < grammar.productions[i].length; j++) {
        if (!nullable[grammar.productions[i][j]]) {
          break;
        }
      }

      head = grammar.productions[i][0];

      if (j == grammar.productions[i].length && !nullable[head]) {
        nullable[head] = true;
        added.push(head);
      }

    }

  } while (added.length > 0);

  return nullable;

};
