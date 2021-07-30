var HeaderView = require("../views/header_view");
var BlankSlateView = require("../views/blank_slate_view");
var SanityView = require("../views/sanity_view");
var SentencesView = require("../views/sentences_view");
var ShortSentencesView = require("../views/short_sentences_view");
var NonterminalsView = require("../views/nonterminals_view");
var ParsingView = require("../views/parsing_view");
var LL1TableView = require("../views/ll1_table_view");
var LR0AutomatonView = require("../views/lr0_automaton_view");
var LR0TableView = require("../views/lr0_table_view");
var SLR1TableView = require("../views/slr1_table_view");
var LR1AutomatonView = require("../views/lr1_automaton_view");
var LR1TableView = require("../views/lr1_table_view");
var LALR1AutomatonView = require("../views/lalr1_automaton_view");
var LALR1TableView = require("../views/lalr1_table_view");

var AnalysisController = function(element) {

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

AnalysisController.prototype.setDelegate = function(delegate) {

  this._delegate = delegate;

}

AnalysisController.prototype.reload = function() {

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
      if (this._views[i].instance.teardown)
        this._views[i].instance.teardown();

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

      var instance = new route.views[i].constructor(element);
      instance.setDelegate(this);

      if (instance.setup)
        instance.setup();

      if (instance.reload)
        instance.reload();

      this._views[i] = {
        instance: instance,
        element: element
      };

    }

    this._headerElement.style.display = '';
    this._blankSlateElement.style.display = 'none';

  } else {

    this._headerElement.style.display = 'none';
    this._blankSlateElement.style.display = '';

  }

  this._headerView.reload();
  this._blankSlateView.reload();

  // possibly reset scroll to top-left

  if (pathChanged) {

    this._element.scrollLeft = 0;
    this._element.scrollTop = 0;

  }

}

AnalysisController.prototype.getCalculation = function(name) {

  return this._grammar.calculate(name);

}

AnalysisController.prototype.getPathComponents = function() {

  return this._routes[this._path].path;

}

module.exports = AnalysisController;
