import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import {
  formatSymbolListWithRenderer,
  formatSentenceWithRenderer,
  formatProductionWithRenderer,
  listSymbols,
  formatSymbol
} from "../helpers.js";

function formatUnreachable(unreachable, info) {
  if (unreachable.size > 0) {
    return (
      <li>
        <Trans
          i18nKey="sanity.unreachableNonterminals"
          components={{
            symbols: formatSymbolListWithRenderer(
              listSymbols(unreachable, info.productionOrder),
              info,
              ", ",
              formatSymbol
            )
          }}
        />
      </li>
    );
  } else {
    return (
      <li>
        <Trans i18nKey="sanity.allNonterminalsReachable" />
      </li>
    );
  }
}

function formatUnrealizable(unrealizable, info) {
  if (unrealizable.size > 0) {
    return (
      <li>
        <Trans
          i18nKey="sanity.unrealizableNonterminals"
          components={{
            symbols: formatSymbolListWithRenderer(
              listSymbols(unrealizable, info.productionOrder),
              info,
              ", ",
              formatSymbol
            )
          }}
        />
      </li>
    );
  } else {
    return (
      <li>
        <Trans i18nKey="sanity.allNonterminalsRealizable" />
      </li>
    );
  }
}

function formatCycle(cycle, info) {
  if (typeof cycle !== "undefined") {
    return (
      <li>
        <Trans
          i18nKey="sanity.cycle"
          components={{
            symbols: formatSymbolListWithRenderer(
              cycle,
              info,
              " \u21D2 ",
              formatSymbol
            )
          }}
        />
      </li>
    );
  } else {
    return (
      <li>
        <Trans i18nKey="sanity.noCycles" />
      </li>
    );
  }
}

function formatNullAmbiguity(nullAmbiguity, productions, info) {
  if (nullAmbiguity.length > 0) {
    return (
      <li>
        <Trans
          i18nKey="sanity.nullAmbiguity"
          components={{
            production1: formatProductionWithRenderer(
              productions[nullAmbiguity[0]],
              info,
              formatSymbol
            ),
            production2: formatProductionWithRenderer(
              productions[nullAmbiguity[1]],
              info,
              formatSymbol
            )
          }}
        />
      </li>
    );
  } else {
    return (
      <li>
        <Trans i18nKey="sanity.nullUnambiguous" />
      </li>
    );
  }
}

function formatAmbiguous(ambiguous, info) {
  if (typeof ambiguous !== "undefined") {
    return (
      <li>
        <Trans
          i18nKey="sanity.grammarIsAmbiguous"
          components={{
            sentence: formatSentenceWithRenderer(ambiguous, info, formatSymbol)
          }}
        />
      </li>
    );
  }

  return null;
}

export const ID = "sanity";
export const TITLE = "analysis." + ID;

export default function SanityComponent({ grammar }) {
  const { t } = useTranslation();
  const {
    unreachable,
    unrealizable,
    cycle,
    nullAmbiguity,
    productions,
    symbolInfo
  } = grammar.calculations;
  const ambiguous = grammar.ambiguousSentenceExample;

  return (
    <section id={ID} className="analysis">
      <h2>{t(TITLE)}</h2>

      <ul className="symbols">
        {formatUnreachable(unreachable, symbolInfo)}
        {formatUnrealizable(unrealizable, symbolInfo)}
        {formatCycle(cycle, symbolInfo)}
        {formatNullAmbiguity(nullAmbiguity, productions, symbolInfo)}
        {formatAmbiguous(ambiguous, symbolInfo)}
      </ul>
    </section>
  );
}

SanityComponent.propTypes = {
  grammar: PropTypes.shape({
    calculations: PropTypes.shape({
      unreachable: PropTypes.instanceOf(Set).isRequired,
      unrealizable: PropTypes.instanceOf(Set).isRequired,
      cycle: PropTypes.array,
      nullAmbiguity: PropTypes.array.isRequired,
      productions: PropTypes.array.isRequired,
      symbolInfo: PropTypes.object.isRequired
    }).isRequired,
    ambiguousSentenceExample: PropTypes.array
  }).isRequired
};
