'use strict';

const END = require('../symbols').END;
const Sets = require('../../sets');

module.exports["parsing.ll.ll1_classification"] = function(grammar) {
  
  const nullAmbiguity = grammar.calculate("grammar.nullAmbiguity");
  
  // We can return immediately if the grammar contains a null ambiguity.
  
  if (nullAmbiguity.length > 0) {
    return { member: false, reason: "it contains a null ambiguity" };
  }
  
  const follow = grammar.calculate("grammar.follow");
  const terminals = grammar.calculate("grammar.terminals");
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const nullable = grammar.calculate("grammar.nullable");
  const productions = grammar.calculate("grammar.productions");
  
  // Check for first set clashes. Instead of checking intersections of
  // first sets of all productions alpha_i for a given nonterminal A,
  // set the [A, a] entry of a table for every a in first(alpha_i) for
  // all A and alpha_i in A -> alpha_1 | alpha_2 | ... | alpha_n. If we
  // come upon an entry that has already been set, there is a first
  // set clash.
  
  let table = {};
    
  for (let k in nonterminals) {
  
    table[k] = {};
  
    for (let l in terminals) {
      table[k][l] = false;
    }
  
  }
    
  for (let i = 0; i < productions.length; i++) {
  
    let head = productions[i][0];
    let body = productions[i].slice(1);
  
    let first = grammar.getFirst(body);
    
    for (let s in first) {
      if (table[head][s]) {
        return { member: false, reason: "it contains a first set clash" };
      }
        
      table[head][s] = true;
    }
    
  }
  
  // Check for first/follow set clashes. That is, check that every nullable
  // production has disjoint first and follow sets.
  
  const first = grammar.calculate("grammar.first");
  
  for (let k in nullable) {
    
    if (Sets.any(Sets.intersection(first[k], follow[k]))) {
      return { member: false, reason: "it contains a first/follow set clash" };
    }
    
  }
  
  return { member: true };
  
};

module.exports["parsing.ll.ll1_table"] = function(grammar) {

  let table = {};

  const terminals = grammar.calculate("grammar.terminals");
  const nonterminals = grammar.calculate("grammar.nonterminals");
  const follow = grammar.calculate("grammar.follow");
  const productions = grammar.calculate("grammar.productions");

  // Populate table with blank arrays

  for (let k in nonterminals) {
  
    table[k] = {};
  
    for (let l in terminals) {
      table[k][l] = [];
    }
  
    table[k][END] = [];
  
  }

  // Collect moves

  for (let i = 0; i < productions.length; i++) {
  
    let head = productions[i][0];
    let body = productions[i].slice(1);
  
    // Get the first set of the production's body
  
    let first = grammar.getFirst(body);

    // For each symbol s in first(body), add the production
    // to table[nonterminal][s].

    for (let s in first) {
      table[head][s].push(i);
    }
  
    // If the production is nullable, for each symbol s of follow(head),
    // add this production to table[head][s].
    
    if (grammar.isNullable(body)) {
    
      for (let s in follow[head]) {
        table[head][s].push(i);
      }
    
    }
    
  }

  return table;

};
