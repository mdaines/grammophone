const Relation = require('../relation');
const END = require("../symbols").END;



  module.exports["grammar.classification"] = function(grammar) {

    return {
      "ll1": grammar.calculate("parsing.ll.ll1_classification"),
      "lr0": grammar.calculate("parsing.lr.lr0_classification"),
      "slr1": grammar.calculate("parsing.lr.slr1_classification"),
      "lr1": grammar.calculate("parsing.lr.lr1_classification"),
      "lalr1": grammar.calculate("parsing.lr.lalr1_classification")
    };

  };

  module.exports["grammar.nonterminals"] = function(grammar) {

    var i;
    var nonterminals = {};

    for (i = 0; i < grammar.productions.length; i++)
      nonterminals[grammar.productions[i][0]] = true;

    return nonterminals;

  };

  module.exports["grammar.terminals"] = function(grammar) {

    var i, j;
    var terminals = {};
    var nonterminals = grammar.calculate("grammar.nonterminals");

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (!nonterminals[grammar.productions[i][j]])
          terminals[grammar.productions[i][j]] = true;

      }
    }

    return terminals;

  };

  module.exports["grammar.symbolInfo"] = function(grammar) {

    var i, j, s;

    var terminalOrder = [];
    var nonterminalOrder = [];
    var productionOrder = [];

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var terminals = grammar.calculate("grammar.terminals");

    for (i = 0; i < grammar.productions.length; i++) {

      s = grammar.productions[i][0];

      if (productionOrder.indexOf(s) === -1)
        productionOrder.push(s);

      for (j = 0; j < grammar.productions[i].length; j++) {

        s = grammar.productions[i][j];

        if (nonterminals[s] && nonterminalOrder.indexOf(s) === -1)
          nonterminalOrder.push(s);

        if (terminals[s] && terminalOrder.indexOf(s) === -1)
          terminalOrder.push(s);

      }

    }

    return {
      terminalOrder: terminalOrder,
      nonterminalOrder: nonterminalOrder,
      productionOrder: productionOrder,

      nonterminals: nonterminals,
      terminals: terminals
    };

  };

  module.exports["grammar.start"] = function(grammar) {

    return grammar.productions[0][0];

  };

  module.exports["grammar.productions"] = function(grammar) {

    return grammar.productions;

  };

  module.exports["grammar.unreachable"] = function(grammar) {

    var relation, closure, unreachable;
    var i, j, s;

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var start = grammar.calculate("grammar.start");

    // Build relation:
    // (x,y) | x -> a y b where a and b are strings of terminals or nonterminals

    relation = Relation.create();

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (nonterminals[grammar.productions[i][j]])
          Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);

      }
    }

    // Obtain the closure of the relation

    closure = Relation.closure(relation);

    // Collect unreachable nonterminals

    unreachable = {};

    for (s in nonterminals) {

      if (s != start && (!closure[start] || !closure[start][s]))
        unreachable[s] = true;

    }

    return unreachable;

  };

  module.exports["grammar.unrealizable"] = function(grammar) {

    var marked, added, unrealizable;
    var i, j, s;
    var nonterminals = grammar.calculate("grammar.nonterminals");

    // Is a particular nonterminal realizable?

    marked = {};

    do {

      added = [];

      for (i = 0; i < grammar.productions.length; i++) {

        // Are there any unmarked nonterminals? Break at the first one.

        for (j = 1; j < grammar.productions[i].length; j++) {

          if (!marked[grammar.productions[i][j]] && nonterminals[grammar.productions[i][j]])
            break;

        }

        // If the head of this production is not marked, and all of the symbols in
        // the body of the production were not unmarked nonterminals (ie, they were
        // either marked or terminals), mark the head and record
        // that we marked it in this step.

        if (!marked[grammar.productions[i][0]] && j == grammar.productions[i].length) {
          marked[grammar.productions[i][0]] = true;
          added.push(grammar.productions[i][0]);
        }

      }

    } while (added.length > 0);

    // Collect nonterminals which were not marked.

    unrealizable = {};

    for (s in nonterminals) {

      if (!marked[s])
        unrealizable[s] = true;

    }

    return unrealizable;

  };

  module.exports["grammar.cycle"] = function(grammar) {

    var relation;
    var i, j, k;
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");

    // Build relation
    // (x,y) | x -> a y b, y a nonterminal, a and b nullable

    relation = Relation.create();

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        if (nonterminals[grammar.productions[i][j]]) {

          for (k = 1; k < grammar.productions[i].length; k++) {

            if (j === k)
              continue;

            if (!nonterminals[grammar.productions[i][k]] || !nullable[grammar.productions[i][k]])
              break;

          }

          if (k === grammar.productions[i].length)
            Relation.add(relation, grammar.productions[i][0], grammar.productions[i][j]);

        }

      }
    }

    // Find a cycle if there is one

    return Relation.cycle(relation);

  };

  module.exports["grammar.nullAmbiguity"] = function(grammar) {

    var nonterminals = grammar.calculate("grammar.nonterminals");
    var nullable = grammar.calculate("grammar.nullable");
    var found;
    var nt;
    var i, j;

    // For each nonterminal...

    for (nt in nonterminals) {

      // Look through the productions of this nonterminal for
      // productions which are nullable. If we find more than
      // one, return them as an array (in order).

      found = undefined;

      for (i = 0; i < grammar.productions.length; i++) {

        if (grammar.productions[i][0] == nt) {

          // An empty production is nullable.

          if (grammar.productions[i].length == 1) {

            if (typeof found !== "undefined")
              return i < found ? [i, found] : [found, i];
            else
              found = i;

            continue;

          }

          // A production is nullable if all of its symbols are nullable.

          for (j = 1; j < grammar.productions[i].length; j++) {

            if (!nullable[grammar.productions[i][j]])
              break;

          }

          if (j == grammar.productions[i].length) {

            if (typeof found !== "undefined")
              return i < found ? [i, found] : [found, i];
            else
              found = i;

          }

        }

      }

    }

    return [];

  }

  module.exports["grammar.nullable"] = function(grammar) {

    var nullable = {};
    var added;
    var i, j, head;

    do {

      added = [];

      for (i = 0; i < grammar.productions.length; i++) {

        for (j = 1; j < grammar.productions[i].length; j++) {
          if (!nullable[grammar.productions[i][j]])
            break;
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

  module.exports["grammar.first"] = function(grammar) {

    var immediate, propagation, result;
    var i, j, k;
    var nullable = grammar.calculate("grammar.nullable");
    var nonterminals = grammar.calculate("grammar.nonterminals");

    immediate = Relation.create();
    propagation = Relation.create();

    // For each production, add the first terminal symbol after a sequence of nullable symbols.

    for (i = 0; i < grammar.productions.length; i++) {

      // Skip nullable symbols...

      for (j = 1; j < grammar.productions[i].length; j++) {

        if (!nullable[grammar.productions[i][j]])
          break;

      }

      // If the first non-nullable symbol is a terminal, add it to the immediate first set
      // of this nonterminal.

      if (j < grammar.productions[i].length && !nonterminals[grammar.productions[i][j]])
        Relation.add(immediate, grammar.productions[i][0], grammar.productions[i][j]);

    }

    // For each production, add the prefix of nullable nonterminals, and then the next symbol
    // if it is also a nonterminal.

    for (i = 0; i < grammar.productions.length; i++) {
      for (j = 1; j < grammar.productions[i].length; j++) {

        // Is it a nonterminal? Add it.

        if (nonterminals[grammar.productions[i][j]])
          Relation.add(propagation, grammar.productions[i][0], grammar.productions[i][j]);

        // Is it not nullable? Stop.

        if (!nullable[grammar.productions[i][j]])
          break;

      }
    }

    // Propagate the relation.

    result = Relation.propagate(immediate, propagation);

    // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.

    for (k in nonterminals) {
      if (typeof result[k] === "undefined")
        result[k] = {};
    }

    return result;

  };

  module.exports["grammar.follow"] = function(grammar) {

    var immediate, propagation, result;
    var i, j, k, s;
    var first = grammar.calculate("grammar.first");
    var nullable = grammar.calculate("grammar.nullable");
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var start = grammar.calculate("grammar.start");

    immediate = Relation.create();
    propagation = Relation.create();

    // Add the end of input symbol to the immediate follow set of the grammar's start symbol.

    Relation.add(immediate, start, END);

    // Given a production X -> ... A β, follow(A) includes first(β), except for the empty string.

    for (i = 0; i < grammar.productions.length; i++) {

      for (j = 1; j < grammar.productions[i].length - 1; j++) {

        // If the symbol is a nonterminal...

        if (nonterminals[grammar.productions[i][j]]) {

          // Add the first set of the remaining symbols to the follow set of the symbol

          for (k = j + 1; k < grammar.productions[i].length; k++) {

            // If this symbol is a terminal, add it, and then stop adding.

            if (!nonterminals[grammar.productions[i][k]]) {
              Relation.add(immediate, grammar.productions[i][j], grammar.productions[i][k]);
              break;
            }

            // If it is a nonterminal, add the first set of that nonterminal.

            for (s in first[grammar.productions[i][k]])
              Relation.add(immediate, grammar.productions[i][j], s);

            // Stop if it isn't nullable.

            if (!nullable[grammar.productions[i][k]])
              break;

          }

        }

      }

    }

    // Given a production B -> ... A β where β is nullable or is the empty string, follow(A) includes follow(B)

    for (i = 0; i < grammar.productions.length; i++) {

      // Scan from the end of the right side of the production to the beginning...

      for (j = grammar.productions[i].length - 1; j > 0; j--) {

        // If the symbol is a nonterminal, add the left side.

        if (nonterminals[grammar.productions[i][j]])
          Relation.add(propagation, grammar.productions[i][j], grammar.productions[i][0]);

        // If it isn't nullable, stop.

        if (!nullable[grammar.productions[i][j]])
          break;

      }

    }

    // Propagate the relation

    result = Relation.propagate(immediate, propagation);

    // Ensure that all nonterminals are present as keys, even if that particular follow set is empty.

    for (k in nonterminals) {
      if (typeof result[k] === "undefined")
        result[k] = {};
    }

    return result;

  };

  module.exports["grammar.endable"] = function(grammar) {

    var s;
    var endable = {};
    var follow = grammar.calculate("grammar.follow");

    for (s in follow) {
      if (follow[s][END])
        endable[s] = true;
    }

    return endable;

  };

  // Given a "sentence node" and a grammar, expand the sentence's first
  // realizable nonterminal and return the resulting list of sentence nodes
  // (which may be empty).
  //
  // Each sentence node's "step" member is incremented and its "nonterminals"
  // member adjusted.

  function expandSentenceNode(node, grammar) {

    var i, j;
    var expanded = [];
    var nonterminals = grammar.calculate("grammar.nonterminals");
    var unrealizable = grammar.calculate("grammar.unrealizable");
    var sentence, replacement, nonterminalCount;

    // expand the first realizable nonterminal.

    for (i = 0; i < node.sentence.length; i++) {

      if (nonterminals[node.sentence[i]] && !unrealizable[node.sentence[i]]) {

        for (j = 0; j < grammar.productions.length; j++) {

          if (grammar.productions[j][0] === node.sentence[i]) {

            replacement = grammar.productions[j].slice(1);
            nonterminalCount = 0;

            for (k = 0; k < replacement.length; k++) {
              if (nonterminals[replacement[k]])
                nonterminalCount++;
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

  var MAX_SENTENCES = 30;

  module.exports["grammar.sentences"] = function(grammar) {

    var start = grammar.calculate("grammar.start");

    var i, j;
    var sentences = [];
    var queue = [{ sentence: [start], steps: 0, nonterminals: 1 }];
    var node;
    var expanded;

    do {

      node = queue.shift();
      expanded = expandSentenceNode(node, grammar);

      for (i = 0; i < expanded.length; i++) {

        if (expanded[i].nonterminals === 0)
          sentences.push(expanded[i].sentence);
        else
          queue.push(expanded[i]);

        if (sentences.length >= MAX_SENTENCES)
          break;

      }

      // Sort the queue so that the next sentence is the one with the
      // fewest nonterminals and steps.

      queue = queue.sort(function(a, b) {
        return (a.nonterminals + a.steps) - (b.nonterminals + b.steps);
      });

    } while (queue.length > 0 && sentences.length < MAX_SENTENCES);

    return sentences.sort(function(a, b) {
      if (a.length === b.length)
        return a < b;
      else
        return a.length - b.length;
    });

  };

  module.exports["grammar.ambiguous"] = function(grammar) {

    var i, j;
    var sentences = grammar.calculate("grammar.sentences");
    var ambiguous = [];

    for (i = 0; i < sentences.length - 1; i++) {
      if (sentences[i].length != sentences[i+1].length)
        continue;

      for (j = 0; j < sentences[i].length; j++) {
        if (sentences[i][j] !== sentences[i+1][j])
          break;
      }

      if (j === sentences[i].length)
        return sentences[i];
    }

  }


