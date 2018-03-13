'use strict';

const HeaderView = require('../views/header_view');
const BlankSlateView = require('../views/blank_slate_view');
const SanityView = require('../views/sanity_view');
const SentencesView = require('../views/sentences_view');
const ShortSentencesView = require('../views/short_sentences_view');
const NonterminalsView = require('../views/nonterminals_view');
const ParsingView = require('../views/parsing_view');
const LL1TableView = require('../views/ll1_table_view');
const LR0AutomatonView = require('../views/lr0_automaton_view');
const LR0TableView = require('../views/lr0_table_view');
const SLR1TableView = require('../views/slr1_table_view');
const LR1AutomatonView = require('../views/lr1_automaton_view');
const LR1TableView = require('../views/lr1_table_view');
const LALR1AutomatonView = require('../views/lalr1_automaton_view');
const LALR1TableView = require('../views/lalr1_table_view');

class AnalysisController {

  constructor(element) {
    this._element = element;
    this._element.id = "analysis";

    // blank slate view

    this._blankSlateElement = document.createElement("section");
    this._element.appendChild(this._blankSlateElement);

    this._blankSlateView = new BlankSlateView(this._blankSlateElement);
    this._blankSlateView.setDelegate(this);

    // header view (managed separately from views which are swapped
    // depending on routes)

    this._headerElement = document.createElement("header");
    this._element.appendChild(this._headerElement);

    this._headerView = new HeaderView(this._headerElement);
    this._headerView.setDelegate(this);

    // routes

    this._routes = {

      "/": {
        views: [
          { id: "sanity", constructor: SanityView },
          { id: "sentences", constructor: ShortSentencesView },
          { id: "nonterminals", constructor: NonterminalsView },
          { id: "parsing", constructor: ParsingView }
        ],
        path: [{ title: "Analysis" }]
      },

      "/ll1-table": {
        views: [
          { id: "table", constructor: LL1TableView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LL(1) Parsing Table" }]
      },

      "/lr0-automaton": {
        views: [
          { id: "automaton", constructor: LR0AutomatonView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LR(0) Automaton" }]
      },

      "/lr0-table": {
        views: [
          { id: "table", constructor: LR0TableView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LR(0) Parsing Table" }]
      },

      "/slr1-table": {
        views: [
          { id: "table", constructor: SLR1TableView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "SLR(1) Parsing Table" }]
      },

      "/lr1-automaton": {
        views: [
          { id: "automaton", constructor: LR1AutomatonView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LR(1) Automaton" }]
      },

      "/lr1-table": {
        views: [
          { id: "table", constructor: LR1TableView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LR(1) Parsing Table" }]
      },

      "/lalr1-automaton": {
        views: [
          { id: "automaton", constructor: LALR1AutomatonView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LALR(1) Automaton" }]
      },

      "/lalr1-table": {
        views: [
          { id: "table", constructor: LALR1TableView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "LALR(1) Parsing Table" }]
      },

      "/sentences": {
        views: [
          { id: "sentences", constructor: SentencesView }
        ],
        path: [{ path: "/", title: "Analysis" }, { title: "Example Sentences" }]
      }

    };

    // view (for routes)

    this._views = [];
  }

  setDelegate(delegate) {
    this._delegate = delegate;
  }

  reload() {
    // get grammar and path

    this._grammar = this._delegate.getGrammar();

    let path = this._delegate.getPath();
    let pathChanged = path !== this._path;
    this._path = path;

    // if we have views, clear them

    if (this._views.length > 0) {

      for (let i = 0; i < this._views.length; i++) {
        if (this._views[i].instance.teardown) {
          this._views[i].instance.teardown();
        }

        this._element.removeChild(this._views[i].element);
      }

      this._views = [];

    }

    // if the grammar is defined, create views

    if (typeof this._grammar !== "undefined") {

      let route = this._routes[this._path];

      for (let i = 0; i < route.views.length; i++) {

        let element = document.createElement("article");
        element.id = route.views[i].id;
        this._element.appendChild(element);

        let instance = new route.views[i].constructor(element);
        instance.setDelegate(this);

        if (instance.setup) {
          instance.setup();
        }

        if (instance.reload) {
          instance.reload();
        }

        this._views[i] = {
          instance: instance,
          element: element
        };

      }

      $(this._headerElement).show();
      $(this._blankSlateElement).hide();

    } else {

      $(this._headerElement).hide();
      $(this._blankSlateElement).show();

    }

    this._headerView.reload();
    this._blankSlateView.reload();

    // possibly reset scroll to top-left

    if (pathChanged) {

      this._element.scrollLeft = 0;
      this._element.scrollTop = 0;

    }
  }

  getCalculation(name) {
    return this._grammar.calculate(name);
  }

  getPathComponents() {
    return this._routes[this._path].path;
  }

}

module.exports = AnalysisController;
