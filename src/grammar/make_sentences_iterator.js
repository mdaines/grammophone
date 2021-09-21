function orderedProductions(grammar, nonterminal) {
  let steps = grammar.calculate("grammar.steps");

  let indexes = [];

  grammar.productions.forEach((p, i) => {
    if (p[0] == nonterminal) {
      indexes.push(i);
    }
  });

  indexes.sort((a, b) => {
    return steps.productions.get(a) - steps.productions.get(b)
  });

  return indexes.map(i => grammar.productions[i]);
}

function sentenceCost(grammar, sentence) {
  let steps = grammar.calculate("grammar.steps");

  let cost = sentence.length;

  sentence.forEach(s => {
    if (steps.symbols.has(s)) {
      cost += steps.symbols.get(s);
    }
  });

  return cost;
}

module.exports = function(grammar) {
  let start = grammar.calculate("grammar.start");
  let nonterminals = grammar.calculate("grammar.nonterminals");

  let state = {
    grammar,
    sentence: [start], // sentence we're expanding
    productions: orderedProductions(grammar, start), // productions for the symbol we're expanding
    sentenceIndex: 0, // index of nonterminal we're expanding
    productionIndex: 0, // index of the next production to expand
    queue: [] // queue of sentences to expand, ordered by total cost (steps + length?)
  };

  return {
    next: function() {
      if (state.productionIndex == state.productions.length) {
        if (state.queue.length == 0) {
          return { value: undefined, done: true };
        } else {
          state.sentence = state.queue.shift().sentence;
          state.sentenceIndex = state.sentence.findIndex(s => nonterminals.has(s)); // choose symbol with fewest steps instead?

          state.productions = orderedProductions(state.grammar, state.sentence[state.sentenceIndex]);
          state.productionIndex = 0;
        }
      }

      let sentence = state.sentence.slice(0, state.sentenceIndex);
      sentence = sentence.concat(state.productions[state.productionIndex].slice(1));
      sentence = sentence.concat(state.sentence.slice(state.sentenceIndex + 1));

      state.productionIndex += 1;

      if (sentence.every(s => !nonterminals.has(s))) {
        return { value: sentence, done: false };
      } else {
        state.queue.unshift({ sentence, cost: sentenceCost(grammar, sentence) });
        state.queue.sort((a, b) => {
          return a.cost - b.cost;
        });

        return { value: undefined, done: false };
      }

      // if state.productionIndex == state.productions.length, we're done expanding the current sentence
      //   if there are no sentences left in the queue, return { value: undefined, done: true }
      //   otherwise,
      //     dequeue the next sentence, setting state.sentence
      //     set state.sentenceIndex to the index of the symbol we'd like to expand (leftmost, fewest steps...?)
      //     set productions to the productions for that symbol
      //     set productionIndex to 0

      // copy state.sentence and replace the symbol at state.sentenceIndex with the production at state.productionIndex
      // increment state.productionIndex
      // if the resulting sentence has no nonterminals, return { value: sentence, done: false }
      // otherwise, enqueue the resulting sentence and return { value: undefined, done: false }

      return { value: undefined, done: true };
    }
  }
}