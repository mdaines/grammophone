const LRAutomatonView = require("./lr_automaton_view");

module.exports = class LR0AutomatonView extends LRAutomatonView {
  constructor(element) {
    super(element);

    this.calculation = "parsing.lr.lr0_automaton";
    this.title = "LR(0) Automaton";
  }
}
