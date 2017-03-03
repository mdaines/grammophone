'use strict';

// Perform the left-factoring transformation. Group is an array of production
// indices, and prefix is the number of symbols (not counting the head of
// the production) to factor.

function leftFactor(grammar, group, prefix) {
  
  const nonterminals = grammar.calculate("grammar.nonterminals");

  // Find a new symbol...

  let symbol = grammar.productions[group[0]][0];

  do {
    symbol += "'";
  } while (typeof nonterminals[symbol] !== "undefined");

  // Copy productions to changes, marking those we're removing.

  let changes = [];
  let offset = 0;

  for (let i = 0; i < grammar.productions.length; i++) {
  
    if (group.indexOf(i) !== -1) {
      changes.push({ index: i + offset, operation: "delete" });
      offset--;
    }
  
  }

  // Add the reference to the new symbol with the factored prefix

  changes.push({
    production: grammar.productions[group[0]].slice(0, prefix + 1).concat(symbol),
    operation: "insert",
    index: group[0]
  });

  // Add the productions in the group

  for (let i = 0; i < group.length; i++) {
    changes.push({
      production: [symbol].concat(grammar.productions[group[i]].slice(prefix + 1)),
      operation: "insert",
      index: group[0] + i + 1
    });
  }

  return changes;
  
}

// Mini trie implementation for finding factorable prefixes.

class Trie {
  
  constructor() {
    this.root = {
      children: {},
      values: []
    };
  }

  insert(production, value) {
  
    let node = this.root;
  
    for (let i = 0; i < production.length; i++) {
      let s = production[i];
      if (typeof node.children[s] === "undefined") {
        node.children[s] = { children: {}, values: [] };
      }
      node = node.children[s];
    }
  
    node.values.push(value);
  
  }

  getFactorablePrefixes() {
  
    let groups = [];
  
    function _values(length, node) {
    
      let values = [];
    
      values = values.concat(node.values);
    
      for (let symbol in node.children) {
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

}

module.exports["transformations.leftFactor"] = function(grammar) {

  let result = [];
  
  // Build tries for each nonterminal's productions
  
  let productions = {};
  
  for (let i = 0; i < grammar.productions.length; i++) {
    
    let nt = grammar.productions[i][0];
    
    if (typeof productions[nt] === "undefined") {
      productions[nt] = new Trie();
    }
    
    productions[nt].insert(grammar.productions[i].slice(1), i);
    
  }
  
  // Get factorable prefixes and their corresponding productions
  
  for (let nt in productions) {
    
    let factorable = productions[nt].getFactorablePrefixes();
    
    for (let i = 0; i < factorable.length; i++) {
      
      let length = factorable[i].length;
      let group = factorable[i].group;
      group.sort();
      
      result.push({
        name: "leftFactor",
        production: group[0],
        symbol: 0,
        length: length,
        changes: leftFactor(grammar, group, length)
      });
      
    }
    
  }

  return result;

};
