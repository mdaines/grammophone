import BlankSlateComponent from "./blank_slate_component.js";
import HeaderComponent from "./analysis/header_component.js";

import NonterminalsComponent from "./analysis/nonterminals_component.js";
import ParsingComponent from "./analysis/parsing_component.js";
import SanityComponent from "./analysis/sanity_component.js";
import ShortSentencesComponent from "./analysis/short_sentences_component.js";
import SentencesComponent from "./analysis/sentences_component.js";

import LL1TableComponent from "./analysis/parsing/ll1_table_component.js";
import LR0TableComponent from "./analysis/parsing/lr0_table_component.js";
import LR1TableComponent from "./analysis/parsing/lr1_table_component.js";
import LALR1TableComponent from "./analysis/parsing/lalr1_table_component.js";
import SLR1TableComponent from "./analysis/parsing/slr1_table_component.js";

import LR0AutomatonComponent from "./analysis/parsing/lr0_automaton_component.js";
import LR1AutomatonComponent from "./analysis/parsing/lr1_automaton_component.js";
import LALR1AutomatonComponent from "./analysis/parsing/lalr1_automaton_component.js";

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
        <HeaderComponent path={route.path} />

        {
          route.views.map((view) => {
            return (
              <article id={view.id}>
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
