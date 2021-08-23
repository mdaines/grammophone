function removeUnreachable(grammar, group) {

  var i;

  var changes = [];
  var offset = 0;

  // Remove all productions in the group.

  for (i = 0; i < grammar.productions.length; i++) {

    if (group.indexOf(i) !== -1) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }

  }

  return changes;

}

module.exports = function(grammar) {

  var unreachable = grammar.calculate("grammar.unreachable");
  var nt;
  var i;
  var result = [];
  var group;

  for (nt of unreachable) {

    group = [];

    for (i = 0; i < grammar.productions.length; i++) {

      if (grammar.productions[i][0] === nt) {
        group.push(i);
      }

    }

    if (group.length > 0) {

      result.push({
        name: "removeUnreachable",
        production: group[0],
        symbol: 0,
        changes: removeUnreachable(grammar, group)
      });

    }

  }

  return result;

}
