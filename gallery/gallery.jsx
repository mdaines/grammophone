import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import Grammar from "../src/grammar/index.js";
import NonterminalsComponent from "../src/components/analysis/nonterminals_component.jsx";
import ShortSentencesComponent from "../src/components/analysis/short_sentences_component.jsx";
import SanityComponent from "../src/components/analysis/sanity_component.jsx";
import ParsingComponent from "../src/components/analysis/parsing_component.jsx";
import SentencesComponent from "../src/components/analysis/sentences_component.jsx";
import LL1TableComponent from "../src/components/analysis/parsing/ll1_table_component.jsx";
import LR0TableComponent from "../src/components/analysis/parsing/lr0_table_component.jsx";
import LR1TableComponent from "../src/components/analysis/parsing/lr1_table_component.jsx";
import LALR1TableComponent from "../src/components/analysis/parsing/lalr1_table_component.jsx";
import SLR1TableComponent from "../src/components/analysis/parsing/slr1_table_component.jsx";
import LR0AutomatonComponent from "../src/components/analysis/parsing/lr0_automaton_component.jsx";
import LR1AutomatonComponent from "../src/components/analysis/parsing/lr1_automaton_component.jsx";
import LALR1AutomatonComponent from "../src/components/analysis/parsing/lalr1_automaton_component.jsx";

function App({ grammar }) {
  const getCalculation = (name) => grammar.calculate(name);

  return (
    <>
      <SanityComponent grammar={grammar} getCalculation={getCalculation} />
      <NonterminalsComponent grammar={grammar} getCalculation={getCalculation} />
      <ShortSentencesComponent grammar={grammar} getCalculation={getCalculation} />
      <ParsingComponent grammar={grammar} getCalculation={getCalculation} />
      <SentencesComponent grammar={grammar} getCalculation={getCalculation} />
      <LL1TableComponent grammar={grammar} getCalculation={getCalculation} />
      <LR0TableComponent grammar={grammar} getCalculation={getCalculation} />
      <LR1TableComponent grammar={grammar} getCalculation={getCalculation} />
      <LALR1TableComponent grammar={grammar} getCalculation={getCalculation} />
      <SLR1TableComponent grammar={grammar} getCalculation={getCalculation} />
      <LR0AutomatonComponent grammar={grammar} getCalculation={getCalculation} />
      <LR1AutomatonComponent grammar={grammar} getCalculation={getCalculation} />
      <LALR1AutomatonComponent grammar={grammar} getCalculation={getCalculation} />
    </>
  );
}

const grammar = new Grammar([
  ["L", "V", "+", "L"],
  ["L", "num"],
  ["V", "Var", "(", "Var", "+", "V", ")"],
  ["V"],
  ["Var"]
]);

const root = createRoot(document.getElementById("app"));
root.render(<StrictMode><App grammar={grammar} /></StrictMode>);
