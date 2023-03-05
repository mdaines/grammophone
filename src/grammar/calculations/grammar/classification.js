export default function(grammar) {

  return {
    "ll1": grammar.calculate("parsing.ll.ll1_classification"),
    "lr0": grammar.calculate("parsing.lr.lr0_classification"),
    "slr1": grammar.calculate("parsing.lr.slr1_classification"),
    "lr1": grammar.calculate("parsing.lr.lr1_classification"),
    "lalr1": grammar.calculate("parsing.lr.lalr1_classification")
  };

}
