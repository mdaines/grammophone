import { getNewSymbol } from "./helpers.js";

// Perform the left-factoring transformation. Group is an array of production
// indices, and prefix is the number of symbols (not counting the head of
// the production) to factor.

function leftFactor({ productions, symbols }, group, prefix) {

  var i;

  // Find a new symbol...

  var symbol = getNewSymbol(symbols, productions[group[0]][0]);

  // Copy productions to changes, marking those we're removing.

  var changes = [];
  var offset = 0;

  for (i = 0; i < productions.length; i++) {

    if (group.indexOf(i) !== -1) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }

  }

  // Add the reference to the new symbol with the factored prefix

  changes.push({
    production: productions[group[0]].slice(0, prefix + 1).concat(symbol),
    operation: "insert",
    index: group[0]
  });

  // Add the productions in the group

  for (i = 0; i < group.length; i++) {
    changes.push({
      production: [symbol].concat(productions[group[i]].slice(prefix + 1)),
      operation: "insert",
      index: group[0] + i + 1
    });
  }

  return changes;

}

// Mini trie implementation for finding factorable prefixes.

function Trie() {

  this.root = {
    children: {},
    values: []
  };

}

Trie.prototype.insert = function(production, value) {

  var node = this.root;
  var i, s;

  for (i = 0; i < production.length; i++) {
    s = production[i];
    if (typeof node.children[s] === "undefined") {
      node.children[s] = { children: {}, values: [] };
    }
    node = node.children[s];
  }

  node.values.push(value);

}

Trie.prototype.getFactorablePrefixes = function() {

  var groups = [];

  function _values(length, node) {

    var symbol;
    var values = [];

    values = values.concat(node.values);

    for (symbol in node.children) {
      values = values.concat(_values(length + 1, node.children[symbol]));
    }

    if (length > 0 && values.length >= 2) {
      groups.push({ length: length, group: values });
    }

    return values;

  }

  _values(0, this.root);

  return groups;

}

export default function({ productions, symbols }) {

  var i;
  var result = [];
  var nt;

  // Build tries for each nonterminal's productions

  var productionTries = {};

  for (i = 0; i < productions.length; i++) {

    nt = productions[i][0];

    if (typeof productionTries[nt] === "undefined") {
      productionTries[nt] = new Trie();
    }

    productionTries[nt].insert(productions[i].slice(1), i);

  }

  // Get factorable prefixes and their corresponding productions

  var factorable;

  for (nt in productionTries) {

    factorable = productionTries[nt].getFactorablePrefixes();

    for (i = 0; i < factorable.length; i++) {

      var length = factorable[i].length;
      var group = factorable[i].group;
      group.sort();

      result.push({
        name: "leftFactor",
        production: group[0],
        symbol: 0,
        length: length,
        changes: leftFactor({ productions, symbols }, group, length)
      });

    }

  }

  return result;

}
