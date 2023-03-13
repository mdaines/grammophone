function removeUnreachable({ productions }, group) {

  var i;

  var changes = [];
  var offset = 0;

  // Remove all productions in the group.

  for (i = 0; i < productions.length; i++) {

    if (group.indexOf(i) !== -1) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }

  }

  return changes;

}

export default function({ productions, unreachable }) {

  var nt;
  var i;
  var result = [];
  var group;

  for (nt of unreachable) {

    group = [];

    for (i = 0; i < productions.length; i++) {

      if (productions[i][0] === nt) {
        group.push(i);
      }

    }

    if (group.length > 0) {

      result.push({
        name: "removeUnreachable",
        production: group[0],
        symbol: 0,
        changes: removeUnreachable({ productions }, group)
      });

    }

  }

  return result;

}
