import PathComponent from "./analysis/path_component.jsx";

import * as NonterminalsComponent from "./analysis/nonterminals_component.jsx";
import * as ParsingComponent from "./analysis/parsing_component.jsx";
import * as SanityComponent from "./analysis/sanity_component.jsx";
import * as ShortSentencesComponent from "./analysis/short_sentences_component.jsx";
import * as SentencesComponent from "./analysis/sentences_component.jsx";
import * as LL1TableComponent from "./analysis/parsing/ll1_table_component.jsx";
import * as LR0TableComponent from "./analysis/parsing/lr0_table_component.jsx";
import * as LR1TableComponent from "./analysis/parsing/lr1_table_component.jsx";
import * as LALR1TableComponent from "./analysis/parsing/lalr1_table_component.jsx";
import * as SLR1TableComponent from "./analysis/parsing/slr1_table_component.jsx";
import * as LR0AutomatonComponent from "./analysis/parsing/lr0_automaton_component.jsx";
import * as LR1AutomatonComponent from "./analysis/parsing/lr1_automaton_component.jsx";
import * as LALR1AutomatonComponent from "./analysis/parsing/lalr1_automaton_component.jsx";

const ROUTES = {
  "/": {
    views: [
      { id: SanityComponent.ID, component: SanityComponent.default },
      { id: ShortSentencesComponent.ID, component: ShortSentencesComponent.default },
      { id: NonterminalsComponent.ID, component: NonterminalsComponent.default },
      { id: ParsingComponent.ID, component: ParsingComponent.default }
    ],
    path: [{ title: "Analysis" }]
  },

  "/ll1-table": {
    views: [
      { id: LL1TableComponent.ID, component: LL1TableComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LL1TableComponent.TITLE }]
  },

  "/lr0-automaton": {
    views: [
      { id: LR0AutomatonComponent.ID, component: LR0AutomatonComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LR0AutomatonComponent.TITLE }]
  },

  "/lr0-table": {
    views: [
      { id: LR0TableComponent.ID, component: LR0TableComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LR0TableComponent.TITLE }]
  },

  "/slr1-table": {
    views: [
      { id: SLR1TableComponent.ID, component: SLR1TableComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: SLR1TableComponent.TITLE }]
  },

  "/lr1-automaton": {
    views: [
      { id: LR1AutomatonComponent.ID, component: LR1AutomatonComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LR1AutomatonComponent.TITLE }]
  },

  "/lr1-table": {
    views: [
      { id: LR1TableComponent.ID, component: LR1TableComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LR1TableComponent.TITLE }]
  },

  "/lalr1-automaton": {
    views: [
      { id: LALR1AutomatonComponent.ID, component: LALR1AutomatonComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LALR1AutomatonComponent.TITLE }]
  },

  "/lalr1-table": {
    views: [
      { id: LALR1TableComponent.ID, component: LALR1TableComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: LALR1TableComponent.TITLE }]
  },

  "/sentences": {
    views: [
      { id: SentencesComponent.ID, component: SentencesComponent.default }
    ],
    path: [{ path: "/", title: "Analysis" }, { title: SentencesComponent.TITLE }]
  }
};

export default function({ grammar, path }) {
  const route = ROUTES[path];

  return (
    <main id="analysis">
      <PathComponent path={route.path} />

      {
        route.views.map((view) => {
          return <view.component key={view.id} grammar={grammar} />;
        })
      }
    </main>
  );
}
