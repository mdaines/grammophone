import BlankSlateComponent from "./blank_slate_component.jsx";
import HeaderComponent from "./analysis/header_component.jsx";

import NonterminalsComponent from "./analysis/nonterminals_component.jsx";
import ParsingComponent from "./analysis/parsing_component.jsx";
import SanityComponent from "./analysis/sanity_component.jsx";
import ShortSentencesComponent from "./analysis/short_sentences_component.jsx";
import SentencesComponent from "./analysis/sentences_component.jsx";

import LL1TableComponent from "./analysis/parsing/ll1_table_component.jsx";
import LR0TableComponent from "./analysis/parsing/lr0_table_component.jsx";
import LR1TableComponent from "./analysis/parsing/lr1_table_component.jsx";
import LALR1TableComponent from "./analysis/parsing/lalr1_table_component.jsx";
import SLR1TableComponent from "./analysis/parsing/slr1_table_component.jsx";

import LR0AutomatonComponent from "./analysis/parsing/lr0_automaton_component.jsx";
import LR1AutomatonComponent from "./analysis/parsing/lr1_automaton_component.jsx";
import LALR1AutomatonComponent from "./analysis/parsing/lalr1_automaton_component.jsx";

const ROUTES = {
  "/": {
    views: [
      { id: "sanity", component: SanityComponent },
      { id: "sentences", component: ShortSentencesComponent },
      { id: "nonterminals", component: NonterminalsComponent },
      { id: "parsing", component: ParsingComponent }
    ],
    path: [{ title: "Analysis" }]
  },

  "/ll1-table": {
    views: [
      { id: "table", component: LL1TableComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LL(1) Parsing Table" }]
  },

  "/lr0-automaton": {
    views: [
      { id: "automaton", component: LR0AutomatonComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LR(0) Automaton" }]
  },

  "/lr0-table": {
    views: [
      { id: "table", component: LR0TableComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LR(0) Parsing Table" }]
  },

  "/slr1-table": {
    views: [
      { id: "table", component: SLR1TableComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "SLR(1) Parsing Table" }]
  },

  "/lr1-automaton": {
    views: [
      { id: "automaton", component: LR1AutomatonComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LR(1) Automaton" }]
  },

  "/lr1-table": {
    views: [
      { id: "table", component: LR1TableComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LR(1) Parsing Table" }]
  },

  "/lalr1-automaton": {
    views: [
      { id: "automaton", component: LALR1AutomatonComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LALR(1) Automaton" }]
  },

  "/lalr1-table": {
    views: [
      { id: "table", component: LALR1TableComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "LALR(1) Parsing Table" }]
  },

  "/sentences": {
    views: [
      { id: "sentences", component: SentencesComponent }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: "Example Sentences" }]
  }
};

export default function({ grammar, path }) {
  if (typeof grammar !== "undefined") {
    const route = ROUTES[path];

    return (
      <section id="analysis">
        <HeaderComponent key="header" path={route.path} />

        {
          route.views.map((view) => {
            return (
              <article key={view.id} id={view.id}>
                <view.component grammar={grammar} getCalculation={(name) => grammar.calculate(name)} />
              </article>
            );
          })
        }
      </section>
    );
  } else {
    return (
      <section id="analysis">
        <BlankSlateComponent />
      </section>
    );
  }
}
