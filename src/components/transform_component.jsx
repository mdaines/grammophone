import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { formatTransformation, formatSymbol } from "./helpers.js";
import { Fragment } from "react";

function TransformPill({
  symbol,
  symbolInfo,
  productionTransformations,
  productions,
  t
}) {
  return (
    <span className="pill">
      {formatSymbol(symbol, symbolInfo)}
      <select value="symbol" readOnly>
        <option disabled={true} value="symbol">
          {symbol}
        </option>
        {productionTransformations.map(function (transformation, index) {
          return (
            <option key={index} value={transformation.index}>
              {formatTransformation(
                transformation.transformation,
                productions,
                symbolInfo,
                t
              )}
            </option>
          );
        })}
      </select>
    </span>
  );
}

TransformPill.propTypes = {
  symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  symbolInfo: PropTypes.object.isRequired,
  productionTransformations: PropTypes.array.isRequired,
  productions: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired
};

export default function TransformComponent({
  grammar,
  stack,
  index,
  undo,
  redo,
  apply
}) {
  const { t } = useTranslation();
  const {
    allTransformations: transformations,
    symbolInfo,
    productions
  } = grammar.calculations;
  const undoTransformation =
    index > 0 ? stack[index].transformation : undefined;
  const redoTransformation =
    index < stack.length - 1 ? stack[index + 1].transformation : undefined;

  const productionTransformations = [];

  for (let i = 0; i < productions.length; i++) {
    productionTransformations[i] = [];
    for (let j = 0; j < productions[i].length; j++) {
      productionTransformations[i][j] = [];
    }
  }

  for (let i = 0; i < transformations.length; i++) {
    let transformation = transformations[i];
    productionTransformations[transformation.production][
      transformation.symbol
    ].push({
      index: i,
      transformation: transformation
    });
  }

  let undoButton, redoButton;

  if (typeof undoTransformation !== "undefined") {
    undoButton = (
      <button
        className="undo"
        onClick={() => {
          undo();
        }}
      >
        {t("grammar.transformations.undo", {
          transformation: formatTransformation(
            undoTransformation,
            productions,
            symbolInfo,
            t
          )
        })}
      </button>
    );
  }

  if (typeof redoTransformation !== "undefined") {
    redoButton = (
      <button
        className="redo"
        onClick={() => {
          redo();
        }}
      >
        {t("grammar.transformations.redo", {
          transformation: formatTransformation(
            redoTransformation,
            productions,
            symbolInfo,
            t
          )
        })}
      </button>
    );
  }

  return (
    <div id="transform">
      <div className="buttons">
        {undoButton}
        {redoButton}
      </div>

      <table
        className="symbols productions"
        onChange={e => {
          apply(transformations[parseInt(e.target.value)]);
        }}
      >
        <tbody>
          {productions.map(function (production, i) {
            let result = [];

            production.forEach(function (symbol, j) {
              let symbolElement;

              if (productionTransformations[i][j].length > 0) {
                symbolElement = (
                  <TransformPill
                    symbol={symbol}
                    symbolInfo={symbolInfo}
                    productionTransformations={productionTransformations[i][j]}
                    productions={productions}
                    t={t}
                  />
                );
              } else {
                symbolElement = formatSymbol(symbol, symbolInfo);
              }

              result.push(
                <Fragment key={"s" + j}>
                  {j > 0 ? " " : null}
                  {symbolElement}
                  {j === 0 ? " \u2192" : null}
                </Fragment>
              );
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
                <td>{result}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

TransformComponent.propTypes = {
  grammar: PropTypes.shape({
    calculations: PropTypes.shape({
      allTransformations: PropTypes.array.isRequired,
      symbolInfo: PropTypes.object.isRequired,
      productions: PropTypes.array.isRequired
    }).isRequired
  }).isRequired,
  stack: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  apply: PropTypes.func.isRequired
};
