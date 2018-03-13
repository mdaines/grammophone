'use strict';

// Given a "sentence node" and a grammar, expand the sentence's first
// realizable nonterminal and return the resulting list of sentence nodes
// (which may be empty).
//
// Each sentence node's "step" member is incremented and its "nonterminals"
// member adjusted.

function expandSentenceNode(node, grammar) {

  let expanded = [];
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const unrealizable = grammar.calculate("grammar.unrealizable");
  const productions = grammar.calculate("grammar.productions");

  // expand the first realizable nonterminal.

  for (let i = 0; i < node.sentence.length; i++) {

    if (nonterminals[node.sentence[i]] && !unrealizable[node.sentence[i]]) {

      for (let j = 0; j < productions.length; j++) {

        if (productions[j][0] === node.sentence[i]) {

          let replacement = productions[j].slice(1);
          let nonterminalCount = 0;

          for (let k = 0; k < replacement.length; k++) {
            if (nonterminals[replacement[k]]) {
              nonterminalCount++;
            }
          }

          expanded.push({
            sentence: node.sentence.slice(0, i).concat(replacement).concat(node.sentence.slice(i+1)),
            steps: node.steps + 1,
            nonterminals: node.nonterminals - 1 + nonterminalCount
          });

        }

      }

      break;

    }

  }

  return expanded;

}

const MAX_SENTENCES = 30;

module.exports["grammar.sentences"] = function(grammar) {

  const start = grammar.calculate("grammar.start");

  let sentences = [];
  let queue = [{ sentence: [start], steps: 0, nonterminals: 1 }];

  do {

    let node = queue.shift();
    let expanded = expandSentenceNode(node, grammar);

    for (let i = 0; i < expanded.length; i++) {

      if (expanded[i].nonterminals === 0) {
        sentences.push(expanded[i].sentence);
      } else {
        queue.push(expanded[i]);
      }

      if (sentences.length >= MAX_SENTENCES) {
        break;
      }

    }

    // Sort the queue so that the next sentence is the one with the
    // fewest nonterminals and steps.

    queue = queue.sort(function(a, b) {
      return (a.nonterminals + a.steps) - (b.nonterminals + b.steps);
    });

  } while (queue.length > 0 && sentences.length < MAX_SENTENCES);

  return sentences.sort(function(a, b) {
    if (a.length === b.length) {
      return a < b;
    } else {
      return a.length - b.length;
    }
  });

};
