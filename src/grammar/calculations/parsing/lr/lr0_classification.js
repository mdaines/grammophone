export default function({ lr0Table: table, terminals }) {

  var i, s;

  for (i = 0; i < table.length; i++) {

    if (table[i].reduce.length > 1) {
      return { member: false, reason: "it contains a reduce-reduce conflict" };
    }

    if (table[i].reduce.length > 0) {
      for (s in table[i].shift) {
        if (terminals.has(s)) {
          return { member: false, reason: "it contains a shift-reduce conflict" };
        }
      }
    }

  }

  return { member: true };

}
