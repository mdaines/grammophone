//= require views/header_view
//= require views/sanity_view
//= require views/nonterminals_view
//= require views/parsing_view
//= require views/ll1_table_view
//= require views/lr0_automaton_view
//= require views/lr0_table_view
//= require views/slr1_table_view
//= require views/lr1_automaton_view
//= require views/lr1_table_view
//= require views/lalr1_automaton_view
//= require views/lalr1_table_view

var Analysis = function(element) {
  
  this._element = element;
  this._element.id = "analysis";
  
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
        { id: "nonterminals", constructor: NonterminalsView },
        { id: "parsing", constructor: ParsingView }
      ],
      path: []
    },
    
    "/ll1": {
      views: [
        { id: "table", constructor: LL1TableView }
      ],
      path: [{ path: "/", fragment: "parsing", title: "Parsing Algorithms" }, { title: "LL(1) Parsing" }]
    },
    
    "/lr0": {
      views: [
        { id: "automaton", constructor: LR0AutomatonView },
        { id: "table", constructor: LR0TableView }
      ],
      path: [{ path: "/", fragment: "parsing", title: "Parsing Algorithms" }, { title: "LR(0) Parsing" }]
    },
    
    "/slr1": {
      views: [
        { id: "table", constructor: SLR1TableView }
      ],
      path: [{ path: "/", fragment: "parsing", title: "Parsing Algorithms" }, { title: "SLR(1) Parsing" }]
    },
    
    "/lr1": {
      views: [
        { id: "automaton", constructor: LR1AutomatonView },
        { id: "table", constructor: LR1TableView }
      ],
      path: [{ path: "/", fragment: "parsing", title: "Parsing Algorithms" }, { title: "LR(1) Parsing" }]
    },
    
    "/lalr1": {
      views: [
        { id: "automaton", constructor: LALR1AutomatonView },
        { id: "table", constructor: LALR1TableView }
      ],
      path: [{ path: "/", fragment: "parsing", title: "Parsing Algorithms" }, { title: "LALR(1) Parsing" }]
    }
    
  };
  
  // view (for routes)
  
  this._views = [];
  
}

Analysis.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

Analysis.prototype.reload = function() {
  
  var i;
  
  // get grammar and path
  
  this._grammar = this._delegate.getGrammar();
  this._path = this._delegate.getPath();
  
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
    
  }
  
  // ask header view to reload
    
  this._headerView.reload();
  
}

Analysis.prototype.getCalculation = function(name) {
  
  return this._grammar.calculate(name);

}

Analysis.prototype.getPathComponents = function() {
  
  return this._routes[this._path].path;
  
}
