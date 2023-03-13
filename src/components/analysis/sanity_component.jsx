import { formatSentence, formatSymbolList, listSymbols, formatProduction } from "../helpers.js";

function formatUnreachable(unreachable, info) {
  if (unreachable.size > 0) {
    return (
      <li>
        {"The grammar has unreachable nonterminals: "}
        {formatSymbolList(listSymbols(unreachable, info.productionOrder), info)}
      </li>
    );
  } else {
    return <li>{"All nonterminals are reachable."}</li>;
  }
}

function formatUnrealizable(unrealizable, info) {
  if (unrealizable.size > 0) {
    return (
      <li>
        {"The grammar has unrealizable nonterminals: "}
        {formatSymbolList(listSymbols(unrealizable, info.productionOrder), info)}
      </li>
    );
  } else {
    return <li>{"All nonterminals are realizable."}</li>;
  }
}

function formatCycle(cycle, info) {
  if (typeof cycle !== "undefined") {
    return (
      <li>
        {"The grammar is cyclic: "}
        {formatSymbolList(cycle, info, " \u21D2 ")}
        {" is a cycle."}
      </li>
    );
  } else {
    return <li>{"The grammar contains no cycles."}</li>;
  }
}

function formatNullAmbiguity(nullAmbiguity, productions, info) {
  if (nullAmbiguity.length > 0) {
    return (
      <li>
        {"The grammar contains a null ambiguity: "}
        {formatProduction(productions[nullAmbiguity[0]], info)}
        {" and "}
        {formatProduction(productions[nullAmbiguity[1]], info)}
        {" are ambiguously nullable."}
      </li>
    );
  } else {
    return <li>{"The grammar is null unambiguous."}</li>;
  }
}

function formatAmbiguous(ambiguous, info) {
  if (typeof ambiguous !== "undefined") {
    return (
      <li>
        {"The grammar is ambiguous: the sentence "}
        {formatSentence(ambiguous, info)}
        {" has an ambiguous derivation."}
      </li>
    );
  }
}

export const ID = "sanity";
export const TITLE = "Sanity Checks";

export default function({ grammar }) {
  const { unreachable, unrealizable, cycle, nullAmbiguity, productions, symbolInfo } = grammar.calculations;
  const ambiguous = grammar.ambiguousSentenceExample;

  return (
    <section id={ID} className="analysis">
      <h2>{TITLE}</h2>

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
