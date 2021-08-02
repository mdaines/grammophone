// Calculations for building LR(0), LR(1), SLR(1), and LALR(1)
// automata and parsing tables.
//
// Automata are lists of states like this:
//
//   { kernel: [ ... ], items: [ ... ], transitions: { ... } }
//
// Items:
//
//   LR0: { production: -1, index: 0 }
//   LR1: { production: -1, index: 0, lookahead: Grammar.END }
//   LALR1: { production: -1, index: 0, lookaheads: [ Grammar.END, "XYZ" ] }
//
// Parsing tables are also lists of states, each of which are objects
// representing the entries in the parsing table for that state.
//
// Rows for LR(0) parsing tables:
//
//   { shift: { ... }, reduce: [ ... ] }
//
// Examples:
//
//   { shift: { "(": 3, "a": 2, "A": 1 } }
//   { reduce: -1 }
//
// -1 = augmented start state production.
//
// Rows for SLR(1), LR(1), and LALR(1) tables:
//
//   { "symbol": { shift: 6, reduce: [3] }, ... }
//
// Examples:
//
//   { "else": { shift: 6, reduce: [3] } }
//   { "if": { shift: 4 }, "other": { shift: 3 }, "S": { shift: 7 }, "I": { shift: 2 } }

module.exports["parsing.lr.lr0_classification"] = require("./lr0_classification");
module.exports["parsing.lr.lr0_automaton"] = require("./lr0_automaton");
module.exports["parsing.lr.lr0_table"] = require("./lr0_table");
module.exports["parsing.lr.slr1_classification"] = require("./slr1_classification");
module.exports["parsing.lr.slr1_table"] = require("./slr1_table");
module.exports["parsing.lr.lr1_automaton"] = require("./lr1_automaton");
module.exports["parsing.lr.lr1_classification"] = require("./lr1_classification");
module.exports["parsing.lr.lr1_table"] = require("./lr1_table");
module.exports["parsing.lr.lalr1_classification"] = require("./lalr1_classification");
module.exports["parsing.lr.lalr1_automaton"] = require("./lalr1_automaton");
module.exports["parsing.lr.lalr1_table"] = require("./lalr1_table");
