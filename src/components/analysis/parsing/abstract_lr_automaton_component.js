const template = require("../../../templates/lr_automaton_graph");
const { Component } = require("preact");

let viz;

function render(src) {
  if (typeof viz === "undefined") {
    viz = new Viz();
  }

  return viz.renderSVGElement(src)
    .catch((error) => {
      viz = undefined;

      return document.createTextNode(error.toString());
    });
}

module.exports = class AbstractLRAutomatonComponent extends Component {
  shouldComponentUpdate(newProps) {
    this.updateBaseWithRenderedSVG(newProps);
    return false;
  }

  updateBaseWithRenderedSVG({ getCalculation, automatonCalculation, title }) {
    const src = template({
      info: getCalculation("grammar.symbolInfo"),
      automaton: getCalculation(automatonCalculation),
      productions: getCalculation("grammar.productions"),
      start: getCalculation("grammar.start"),
      title: title
    });

    render(src)
      .then((element) => {
        this.base.innerHTML = "";
        this.base.appendChild(element);
      });
  }

  render(props) {
    this.updateBaseWithRenderedSVG(props);

    return <div />;
  }
}
