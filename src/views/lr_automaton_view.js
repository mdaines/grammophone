const template = require("../templates/lr_automaton_graph");

let viz;

module.exports = class LRAutomatonView {
  constructor(element, calculation, title) {
    this._element = element;
    this.calculation = calculation;
    this.title = title;
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    let src = template({
      info: this._delegate.getCalculation("grammar.symbolInfo"),
      automaton: this._delegate.getCalculation(this.calculation),
      productions: this._delegate.getCalculation("grammar.productions"),
      start: this._delegate.getCalculation("grammar.start"),
      title: this.title
    });

    if (typeof viz === "undefined") {
      viz = new Viz();
    }

    viz.renderSVGElement(src)
    .then((element) => {
      this._element.innerHTML = "";
      this._element.appendChild(element);
    })
    .catch((error) => {
      viz = new Viz();
      this._element.innerHTML = error.toString();
    });
  }
}
