import { makeSentencesIterator, takeFromIterator } from "../../sentences_iterator.js";

export default function(grammar) {
  const iterator = makeSentencesIterator(grammar);
  const result = takeFromIterator(iterator, 50, 1000);
  const sentences = result.values;

  let i, j;

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
