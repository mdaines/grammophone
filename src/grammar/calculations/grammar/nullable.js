export default function({ productions }) {

  var nullable = new Set();
  var added;
  var i, j, head;

  do {

    added = [];

    for (i = 0; i < productions.length; i++) {

      for (j = 1; j < productions[i].length; j++) {
        if (!nullable.has(productions[i][j])) {
          break;
        }
      }

      head = productions[i][0];

      if (j == productions[i].length && !nullable.has(head)) {
        nullable.add(head);
        added.push(head);
      }

    }

  } while (added.length > 0);

  return nullable;

}
