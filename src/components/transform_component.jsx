import { formatTransformation, formatSymbol } from "./helpers.js";
import { Fragment } from "react";

function TransformPill({ symbol, symbolInfo, productionTransformations, productions }) {
  return (
    <span className="pill">
      {formatSymbol(symbol, symbolInfo)}
      <select value="symbol" readOnly>
        <option disabled={true} value="symbol">{symbol}</option>
        {
          productionTransformations.map(function(t, index) {
            return (
              <option key={index} value={t.index}>
                {formatTransformation(t.transformation, productions, symbolInfo)}
              </option>
            );
          })
        }
      </select>
    </span>
  );
}

export default function({ grammar, stack, index, undo, redo, apply }) {
  const { allTransformations: transformations, symbolInfo, productions } = grammar.calculations;
  const undoTransformation = index > 0 ? stack[index].transformation : undefined;
  const redoTransformation = index < stack.length - 1 ? stack[index + 1].transformation : undefined;

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

  let undoButton, redoButton;

  if (typeof undoTransformation !== "undefined") {
    undoButton = (
      <button className="undo" onClick={() => { undo(); }}>
        {"Undo "}
        {formatTransformation(undoTransformation, productions, symbolInfo)}
      </button>
    );
  }

  if (typeof redoTransformation !== "undefined") {
    redoButton = (
      <button className="redo" onClick={() => { redo(); }}>
        {"Redo "}
        {formatTransformation(redoTransformation, productions, symbolInfo)}
      </button>
    );
  }

  return (
    <div id="transform">
      <div className="buttons">
        {undoButton}
        {redoButton}
      </div>

      <table className="symbols productions" onChange={(e) => { apply(transformations[parseInt(e.target.value)]); }}>
        <tbody>
          {
            productions.map(function(production, i) {
              let result = [];

              production.forEach(function(symbol, j) {
                let symbolElement;

                if (productionTransformations[i][j].length > 0) {
                  symbolElement = <TransformPill symbol={symbol} symbolInfo={symbolInfo} productionTransformations={productionTransformations[i][j]} productions={productions} />;
                } else {
                  symbolElement = formatSymbol(symbol, symbolInfo);
                }

                result.push(
                  <Fragment key={"s"+j}>
                    {j > 0 ? " " : null}
                    {symbolElement}
                    {j === 0 ? " \u2192" : null}
                  </Fragment>
                )
              });

              if (production.length === 1) {
                result.push(
                  <Fragment key="epsilon">
                    {" "}
                    <u>{"\u03B5"}</u>
                  </Fragment>
                );
              }

              return (
                <tr key={i}>
                  <td>
                    {result}
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
