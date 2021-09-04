const LRAutomatonView = require("./lr_automaton_view");

module.exports = class LR1AutomatonView extends LRAutomatonView {
  constructor(element) {
    super(element);

    this.calculation = "parsing.lr.lr1_automaton";
    this.title = "LR(1) Automaton";
  }
}
