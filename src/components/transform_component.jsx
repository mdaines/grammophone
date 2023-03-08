import { formatTransformation, formatSymbol } from "./helpers.js";

export default function({ grammar, stack, index, undo, redo, apply }) {
  const transformations = grammar.calculate("transformations.all");
  const undoTransformation = index > 0 ? stack[index].transformation : undefined;
  const redoTransformation = index < stack.length - 1 ? stack[index + 1].transformation : undefined;
  const productions = grammar.productions;
  const info = grammar.calculate("grammar.symbolInfo");

  const buttons = [];

  if (typeof undoTransformation !== "undefined") {
    buttons.push(
      <button class="undo" onClick={() => { undo(); }}>
        {"Undo "}
        {formatTransformation(undoTransformation, productions, info)}
      </button>
    );
  }

  if (typeof redoTransformation !== "undefined") {
    buttons.push(
      <button class="redo" onClick={() => { redo(); }}>
        {"Redo "}
        {formatTransformation(redoTransformation, productions, info)}
      </button>
    );
  }

  const productionTransformations = [];

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

  return (
    <section id="transform">
      <article>
        <div class="buttons">{buttons}</div>

        <table class="symbols productions" onChange={(e) => { apply(transformations[parseInt(e.target.value)]); }}>
          {
            productions.map(function(production, i) {
              let result = [];

              production.forEach(function(symbol, j) {
                if (j > 0) {
                  result.push(" ");
                }

                if (productionTransformations[i][j].length > 0) {
                  result.push(
                    <span class="pill">
                      {formatSymbol(symbol, info)}
                      <select value="symbol">
                        <option disabled={true} value="symbol">{symbol}</option>
                        {
                          productionTransformations[i][j].map(function(t) {
                            return (
                              <option value={t.index}>
                                {formatTransformation(t.transformation, productions, info)}
                              </option>
                            );
                          })
                        }
                      </select>
                    </span>
                  );
                } else {
                  result.push(formatSymbol(symbol, info));
                }

                if (j === 0) {
                  result.push(" ");
                  result.push("\u2192"); // arrow
                }
              });

              if (production.length === 1) {
                result.push(" ");
                result.push(<u>{"\u03B5"}</u>); // epsilon
              }

              return (
                <tr>
                  <td>{result}</td>
                </tr>
              );
            })
          }
        </table>
      </article>
    </section>
  );
}
