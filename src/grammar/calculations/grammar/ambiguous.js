export default function(grammar) {

  var i, j;
  var sentences = grammar.calculate("grammar.sentences");

  for (i = 0; i < sentences.length - 1; i++) {
    if (sentences[i].length != sentences[i+1].length) {
      continue;
    }

    for (j = 0; j < sentences[i].length; j++) {
      if (sentences[i][j] !== sentences[i+1][j]) {
        break;
      }
    }

    if (j === sentences[i].length) {
      return sentences[i];
    }
  }

}
