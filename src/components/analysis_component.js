const BlankSlateComponent = require("./blank_slate_component.js");
const HeaderComponent = require("./analysis/header_component.js");

const NonterminalsComponent = require("./analysis/nonterminals_component.js");
const ParsingComponent = require("./analysis/parsing_component.js");
const SanityComponent = require("./analysis/sanity_component.js");
const ShortSentencesComponent = require("./analysis/short_sentences_component.js");
const SentencesComponent = require("./analysis/sentences_component.js");

const LL1TableComponent = require("./analysis/parsing/ll1_table_component.js");
const LR0TableComponent = require("./analysis/parsing/lr0_table_component.js");
const LR1TableComponent = require("./analysis/parsing/lr1_table_component.js");
const LALR1TableComponent = require("./analysis/parsing/lalr1_table_component.js");
const SLR1TableComponent = require("./analysis/parsing/slr1_table_component.js");

const LR0AutomatonComponent = require("./analysis/parsing/lr0_automaton_component.js");
const LR1AutomatonComponent = require("./analysis/parsing/lr1_automaton_component.js");
const LALR1AutomatonComponent = require("./analysis/parsing/lalr1_automaton_component.js");

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

module.exports = function({ grammar, path }) {
  if (typeof grammar !== "undefined") {
    const route = ROUTES[path];

    return (
      <section id="analysis">
        <HeaderComponent path={route.path} />

        {
          route.views.map((view) => {
            return (
              <article id={view.id}>
                <view.component getCalculation={(name) => grammar.calculate(name)} />
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
