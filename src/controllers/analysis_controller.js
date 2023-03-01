const { render } = require("preact");
const BlankSlateComponent = require("../components/blank_slate_component.js");
const HeaderComponent = require("../components/analysis/header_component.js");
const NonterminalsComponent = require("../components/analysis/nonterminals_component.js");
const ParsingComponent = require("../components/analysis/parsing_component.js");
const SanityComponent = require("../components/analysis/sanity_component.js");
const ShortSentencesComponent = require("../components/analysis/short_sentences_component.js");
const SentencesComponent = require("../components/analysis/sentences_component.js");

const LL1TableComponent = require("../components/analysis/parsing/ll1_table_component.js");
const LR0TableComponent = require("../components/analysis/parsing/lr0_table_component.js");
const LR1TableComponent = require("../components/analysis/parsing/lr1_table_component.js");
const LALR1TableComponent = require("../components/analysis/parsing/lalr1_table_component.js");
const SLR1TableComponent = require("../components/analysis/parsing/slr1_table_component.js");

var LR0AutomatonView = require("../views/lr0_automaton_view");
var LR1AutomatonView = require("../views/lr1_automaton_view");
var LALR1AutomatonView = require("../views/lalr1_automaton_view");

module.exports = class AnalysisController {
  constructor(element) {

    this._element = element;
    this._element.id = "analysis";

    // blank slate view

    this._blankSlateElement = document.createElement("section");
    this._blankSlateElement.className = "blank-slate";
    this._element.appendChild(this._blankSlateElement);

    // header view (managed separately from views which are swapped
    // depending on routes)

    this._headerElement = document.createElement("header");
    this._headerElement.className = "header";
    this._element.appendChild(this._headerElement);

    // routes

    this._routes = {

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
          { id: "automaton", constructor: LR0AutomatonView }
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
          { id: "automaton", constructor: LR1AutomatonView }
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
          { id: "automaton", constructor: LALR1AutomatonView }
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

    // view (for routes)

    this._views = [];

  }

  _render() {
    render(<BlankSlateComponent />, this._blankSlateElement);
    render(<HeaderComponent path={this.getPathComponents()} />, this._headerElement);

    for (let view of this._views) {
      if (view.component) {
        render(<view.component getCalculation={(c) => this.getCalculation(c)} />, view.element);
      }
    }
  }

  setDelegate(delegate) {

    this._delegate = delegate;

  }

  reload() {

    var i;
    var path, pathChanged;

    // get grammar and path

    this._grammar = this._delegate.getGrammar();

    path = this._delegate.getPath();
    pathChanged = path !== this._path;
    this._path = path;

    // if we have views, clear them

    if (this._views.length > 0) {

      for (i = 0; i < this._views.length; i++) {
        this._element.removeChild(this._views[i].element);
      }

      this._views = [];

    }

    // if the grammar is defined, create views

    if (typeof this._grammar !== "undefined") {

      var route = this._routes[this._path];

      for (i = 0; i < route.views.length; i++) {

        var element = document.createElement("article");
        element.id = route.views[i].id;
        this._element.appendChild(element);

        if (route.views[i].component) {
          this._views[i] = {
            component: route.views[i].component,
            element: element
          };
        } else {
          var instance = new route.views[i].constructor(element);
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

      }

      this._headerElement.style.display = '';
      this._blankSlateElement.style.display = 'none';

    } else {

      this._headerElement.style.display = 'none';
      this._blankSlateElement.style.display = '';

    }

    this._render();

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
