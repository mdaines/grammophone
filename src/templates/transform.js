const m = require("mithril");
const Helpers = require("../helpers");
const formatTransformation = require("../helpers").formatTransformation;

module.exports = function(input) {
  let productions = input.productions;
  let info = input.info;
  let undoTransformation = input.undoTransformation;
  let redoTransformation = input.redoTransformation;
  let transformations = input.transformations;

  let buttons = [];

  if (typeof undoTransformation !== "undefined") {
    buttons.push(
      m("button.undo", { "data-action": "undo" },
        "Undo ",
        formatTransformation(undoTransformation, productions, info)
      )
    );
  }

  if (typeof redoTransformation !== "undefined") {
    buttons.push(
      m("button.redo", { "data-action": "redo" },
        "Redo ",
        formatTransformation(redoTransformation, productions, info)
      )
    );
  }

  let productionTransformations = [];

  for (let i = 0; i < productions.length; i++) {
    productionTransformations[i] = [];
    for (let j = 0; j < productions[i].length; j++) {
      productionTransformations[i][j] = [];
    }
  }

  for (let i = 0; i < transformations.length; i++) {
    let transformation = transformations[i];
    productionTransformations[transformation.production][transformation.symbol].push({
      index: i,
      transformation: transformation
    });
  }

  return [
    m("div.buttons", buttons),

    m("table.symbols.productions",
      productions.map(function(production, i) {
        let result = [];

        production.forEach(function(symbol, j) {
          if (j > 0) {
            result.push(" ");
          }

          if (productionTransformations[i][j].length > 0) {
            result.push(
              m("span.pill",
                Helpers.formatSymbol(symbol, info),
                m("select",
                  m("option", { disabled: true, selected: true }, symbol),
                  productionTransformations[i][j].map(function(t) {
                    return m("option", { value: t.index },
                      formatTransformation(t.transformation, productions, info)
                    );
                  })
                )
              )
            );
          } else {
            result.push(Helpers.formatSymbol(symbol, info));
          }

          if (j === 0) {
            result.push(" ");
            result.push("\u2192"); // arrow
          }
        });

        if (production.length === 1) {
          result.push(" ");
          result.push(m("u", "\u03B5")); // epsilon
        }

        return m("tr",
          m("td", result)
        );
      })
    )
  ];
}
