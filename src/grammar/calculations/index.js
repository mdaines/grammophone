import grammar_classification from "./grammar/classification.js";
import grammar_nonterminals from "./grammar/nonterminals.js";
import grammar_terminals from "./grammar/terminals.js";
import grammar_symbolInfo from "./grammar/symbolInfo.js";
import grammar_start from "./grammar/start.js";
import grammar_productions from "./grammar/productions.js";
import grammar_unreachable from "./grammar/unreachable.js";
import grammar_unrealizable from "./grammar/unrealizable.js";
import grammar_cycle from "./grammar/cycle.js";
import grammar_nullAmbiguity from "./grammar/nullAmbiguity.js";
import grammar_nullable from "./grammar/nullable.js";
import grammar_first from "./grammar/first.js";
import grammar_follow from "./grammar/follow.js";
import grammar_endable from "./grammar/endable.js";
import grammar_derivationSteps from "./grammar/derivationSteps.js";
import grammar_symbols from "./grammar/symbols.js";
import grammar_ambiguous from "./grammar/ambiguous.js";
import parsing_ll_ll1_classification from "./parsing/ll/ll1_classification.js";
import parsing_ll_ll1_table from "./parsing/ll/ll1_table.js";
import parsing_lr_lr0_classification from "./parsing/lr/lr0_classification.js";
import parsing_lr_lr0_automaton from "./parsing/lr/lr0_automaton.js";
import parsing_lr_lr0_table from "./parsing/lr/lr0_table.js";
import parsing_lr_slr1_classification from "./parsing/lr/slr1_classification.js";
import parsing_lr_slr1_table from "./parsing/lr/slr1_table.js";
import parsing_lr_lr1_automaton from "./parsing/lr/lr1_automaton.js";
import parsing_lr_lr1_classification from "./parsing/lr/lr1_classification.js";
import parsing_lr_lr1_table from "./parsing/lr/lr1_table.js";
import parsing_lr_lalr1_classification from "./parsing/lr/lalr1_classification.js";
import parsing_lr_lalr1_automaton from "./parsing/lr/lalr1_automaton.js";
import parsing_lr_lalr1_table from "./parsing/lr/lalr1_table.js";
import transformations_expand from "./transformations/expand.js";
import transformations_removeImmediateLeftRecursion from "./transformations/removeImmediateLeftRecursion.js";
import transformations_leftFactor from "./transformations/leftFactor.js";
import transformations_epsilonSeparate from "./transformations/epsilonSeparate.js";
import transformations_removeUnreachable from "./transformations/removeUnreachable.js";
import transformations_all from "./transformations/all.js";

export default {
  "grammar.classification": grammar_classification,
  "grammar.nonterminals": grammar_nonterminals,
  "grammar.terminals": grammar_terminals,
  "grammar.symbolInfo": grammar_symbolInfo,
  "grammar.start": grammar_start,
  "grammar.productions": grammar_productions,
  "grammar.unreachable": grammar_unreachable,
  "grammar.unrealizable": grammar_unrealizable,
  "grammar.cycle": grammar_cycle,
  "grammar.nullAmbiguity": grammar_nullAmbiguity,
  "grammar.nullable": grammar_nullable,
  "grammar.first": grammar_first,
  "grammar.follow": grammar_follow,
  "grammar.endable": grammar_endable,
  "grammar.derivationSteps": grammar_derivationSteps,
  "grammar.symbols": grammar_symbols,
  "grammar.ambiguous": grammar_ambiguous,
  "parsing.ll.ll1_classification": parsing_ll_ll1_classification,
  "parsing.ll.ll1_table": parsing_ll_ll1_table,
  "parsing.lr.lr0_classification": parsing_lr_lr0_classification,
  "parsing.lr.lr0_automaton": parsing_lr_lr0_automaton,
  "parsing.lr.lr0_table": parsing_lr_lr0_table,
  "parsing.lr.slr1_classification": parsing_lr_slr1_classification,
  "parsing.lr.slr1_table": parsing_lr_slr1_table,
  "parsing.lr.lr1_automaton": parsing_lr_lr1_automaton,
  "parsing.lr.lr1_classification": parsing_lr_lr1_classification,
  "parsing.lr.lr1_table": parsing_lr_lr1_table,
  "parsing.lr.lalr1_classification": parsing_lr_lalr1_classification,
  "parsing.lr.lalr1_automaton": parsing_lr_lalr1_automaton,
  "parsing.lr.lalr1_table": parsing_lr_lalr1_table,
  "transformations.expand": transformations_expand,
  "transformations.removeImmediateLeftRecursion": transformations_removeImmediateLeftRecursion,
  "transformations.leftFactor": transformations_leftFactor,
  "transformations.epsilonSeparate": transformations_epsilonSeparate,
  "transformations.removeUnreachable": transformations_removeUnreachable,
  "transformations.all": transformations_all
};
