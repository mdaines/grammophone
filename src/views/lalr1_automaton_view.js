const LRAutomatonView = require("./lr_automaton_view");

module.exports = class LALR1AutomatonView extends LRAutomatonView {
  constructor(element) {
    super(element);

    this.calculation = "parsing.lr.lalr1_automaton";
    this.title = "LALR(1) Automaton";
  }
}
