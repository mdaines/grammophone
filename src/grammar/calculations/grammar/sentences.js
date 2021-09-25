const makeSentencesIterator = require("../../make_sentences_iterator");

module.exports = function(grammar) {
  let iterator = makeSentencesIterator(grammar);
  let sentences = [];

  for (let i = 0; i < 1000 && sentences.length < 50; i++) {
    let result = iterator.next();
    if (result.value) {
      sentences.push(result.value);
    } else if (result.done) {
      break;
    }
  }

  return sentences;
};
