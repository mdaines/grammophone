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
      path: [{ href: "/#parsing", title: "Parsing Algorithms" }, { title: "LL(1) Parsing" }]
    },
    
    "/lr0": {
      views: [
        { id: "automaton", constructor: LR0AutomatonView },
        { id: "table", constructor: LR0TableView }
      ],
      path: [{ href: "/#parsing", title: "Parsing Algorithms" }, { title: "LR(0) Parsing" }]
    },
    
    "/slr1": {
      views: [
        { id: "table", constructor: SLR1TableView }
      ],
      path: [{ href: "/#parsing", title: "Parsing Algorithms" }, { title: "SLR(1) Parsing" }]
    },
    
    "/lr1": {
      views: [
        { id: "automaton", constructor: LR1AutomatonView },
        { id: "table", constructor: LR1TableView }
      ],
      path: [{ href: "/#parsing", title: "Parsing Algorithms" }, { title: "LR(1) Parsing" }]
    },
    
    "/lalr1": {
      views: [
        { id: "automaton", constructor: LALR1AutomatonView },
        { id: "table", constructor: LALR1TableView }
      ],
      path: [{ href: "/#parsing", title: "Parsing Algorithms" }, { title: "LALR(1) Parsing" }]
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
  
  // is the path different?
  
  var path = this._delegate.getPath();
  
  if (path == this._path) {
    
    // if not, call reload on our views
    
    for (i = 0; i < this._views.length; i++) {
      if (this._views[i].instance.reload)
        this._views[i].instance.reload();
    }
    
  } else {
    
    // if so, note that we have a new path
    
    this._path = path;
  
    // remove any old views
  
    for (i = 0; i < this._views.length; i++) {
    
      if (this._views[i].instance.teardown)
        this._views[i].instance.teardown();
    
      this._element.removeChild(this._views[i].element);
    
    }
  
    // create new views and ask them to setup and reload
  
    var route = this._routes[this._path];
  
    this._views = [];
  
    for (i = 0; i < route.views.length; i++) {
    
      var element = document.createElement("article");
      element.id = route.views[i].id;
      this._element.appendChild(element);
  
      var instance = new route.views[i].constructor(element);
      instance.setDelegate(this);
  
      // setup and reload (FIXME: defer?)
  
      if (instance.setup)
        instance.setup();
      
      if (instance.reload)
        instance.reload();
  
      this._views[i] = {
        instance: instance,
        element: element
      };
    
    }
    
    // ask header view to reload
    
    this._headerView.reload();
    
  }
  
}

Analysis.prototype.getCalculation = function(name) {
  
  return FAKE_CALCULATIONS[name];

}

Analysis.prototype.getPathComponents = function() {
  
  return this._routes[this._path].path;
  
}

var FAKE_CALCULATIONS = {
  "grammar.unreachable": {"T":true,"V":true},
  "grammar.unrealizable": {"S":true},
  "grammar.cycle": ["S","T","S"],
  "grammar.nullAmbiguity": [7, 6],
  "grammar.productions": [["S","id","T"], ["T","V","assign","E"], ["T"], ["V"], ["E","id","V"], ["E","num"], ["S"], ["S", "T"]],
  "grammar.symbolInfo": {"productionOrder":["S","T","V","E"],"terminalOrder":["id","assign","num"],"nonterminalOrder":["S","T","V","E"], "nonterminals":{"S":true,"T":true,"V":true,"E":true}, "terminals":{"id":true,"assign":true,"num":true}},
  "grammar.classification": {
    "rd": { member: false, reason: "some reason" },
    "ll1": { member: true },
    "lr0": { member: true },
    "slr1": { member: false, reason: "it has a conflict of some sort" },
    "lr1": { member: true },
    "lalr1": { member: true }
  },
  "grammar.nullable": {"T":true,"V":true,"X":true},
  "grammar.endable": {"S":true,"V":true,"T":true,"E":true},
  "grammar.first": {"S":{"id":true},"T":{"assign":true},"E":{"id":true,"num":true}},
  "grammar.follow": {"S":{"Grammar.END":true},"V":{"assign":true,"Grammar.END":true},"T":{"Grammar.END":true},"E":{"Grammar.END":true}},
  "parsing.ll.ll1_table": {"S":{"id":[0],"assign":[],"num":[],"Grammar.END":[]},"T":{"id":[],"assign":[1],"num":[],"Grammar.END":[2]},"V":{"id":[],"assign":[3],"num":[],"Grammar.END":[3]},"E":{"id":[4],"assign":[],"num":[5],"Grammar.END":[]}},
  "parsing.lr.lr0_table": [{"shift":{"S":1,"id":2},"reduce":[]},{"shift":{},"reduce":[-1]},{"shift":{"T":3,"V":4},"reduce":[2,3]},{"shift":{},"reduce":[0]},{"shift":{"assign":5},"reduce":[]},{"shift":{"E":6,"id":7,"num":8},"reduce":[]},{"shift":{},"reduce":[1]},{"shift":{"V":9},"reduce":[3]},{"shift":{},"reduce":[5]},{"shift":{},"reduce":[4]}],
  "parsing.lr.lr0_automaton": [{"kernel":[{"production":-1,"index":0}],"items":[{"production":-1,"index":0},{"production":0,"index":0}],"transitions":{"S":1,"id":2}},{"kernel":[{"production":-1,"index":1}],"items":[{"production":-1,"index":1}],"transitions":{}},{"kernel":[{"production":0,"index":1}],"items":[{"production":0,"index":1},{"production":1,"index":0},{"production":2,"index":0},{"production":3,"index":0}],"transitions":{"T":3,"V":4}},{"kernel":[{"production":0,"index":2}],"items":[{"production":0,"index":2}],"transitions":{}},{"kernel":[{"production":1,"index":1}],"items":[{"production":1,"index":1}],"transitions":{"assign":5}},{"kernel":[{"production":1,"index":2}],"items":[{"production":1,"index":2},{"production":4,"index":0},{"production":5,"index":0}],"transitions":{"E":6,"id":7,"num":8}},{"kernel":[{"production":1,"index":3}],"items":[{"production":1,"index":3}],"transitions":{}},{"kernel":[{"production":4,"index":1}],"items":[{"production":4,"index":1},{"production":3,"index":0}],"transitions":{"V":9}},{"kernel":[{"production":5,"index":1}],"items":[{"production":5,"index":1}],"transitions":{}},{"kernel":[{"production":4,"index":2}],"items":[{"production":4,"index":2}],"transitions":{}}],
  "grammar.start": "S",
  "parsing.lr.lr0_automaton": [{"kernel":[{"production":-1,"index":0}],"items":[{"production":-1,"index":0},{"production":0,"index":0}],"transitions":{"S":1,"id":2}},{"kernel":[{"production":-1,"index":1}],"items":[{"production":-1,"index":1}],"transitions":{}},{"kernel":[{"production":0,"index":1}],"items":[{"production":0,"index":1},{"production":1,"index":0},{"production":2,"index":0},{"production":3,"index":0}],"transitions":{"T":3,"V":4}},{"kernel":[{"production":0,"index":2}],"items":[{"production":0,"index":2}],"transitions":{}},{"kernel":[{"production":1,"index":1}],"items":[{"production":1,"index":1}],"transitions":{"assign":5}},{"kernel":[{"production":1,"index":2}],"items":[{"production":1,"index":2},{"production":4,"index":0},{"production":5,"index":0}],"transitions":{"E":6,"id":7,"num":8}},{"kernel":[{"production":1,"index":3}],"items":[{"production":1,"index":3}],"transitions":{}},{"kernel":[{"production":4,"index":1}],"items":[{"production":4,"index":1},{"production":3,"index":0}],"transitions":{"V":9}},{"kernel":[{"production":5,"index":1}],"items":[{"production":5,"index":1}],"transitions":{}},{"kernel":[{"production":4,"index":2}],"items":[{"production":4,"index":2}],"transitions":{}}],
"parsing.lr.slr1_table":[{"S":{"shift":1},"id":{"shift":2}},{"Grammar.END":{"reduce":[-1]}},{"T":{"shift":3},"V":{"shift":4},"Grammar.END":{"reduce":[2,3]},"assign":{"reduce":[3]}},{"Grammar.END":{"reduce":[0]}},{"assign":{"shift":5}},{"E":{"shift":6},"id":{"shift":7},"num":{"shift":8}},{"Grammar.END":{"reduce":[1]}},{"V":{"shift":9},"assign":{"reduce":[3]},"Grammar.END":{"reduce":[3]}},{"Grammar.END":{"reduce":[5]}},{"Grammar.END":{"reduce":[4]}}],
  "parsing.lr.lr1_automaton": [{"kernel":[{"production":-1,"index":0,"lookahead":"Grammar.END"}],"items":[{"production":-1,"index":0,"lookahead":"Grammar.END"},{"production":0,"index":0,"lookahead":"Grammar.END"}],"transitions":{"S":1,"id":2}},{"kernel":[{"production":-1,"index":1,"lookahead":"Grammar.END"}],"items":[{"production":-1,"index":1,"lookahead":"Grammar.END"}],"transitions":{}},{"kernel":[{"production":0,"index":1,"lookahead":"Grammar.END"}],"items":[{"production":0,"index":1,"lookahead":"Grammar.END"},{"production":1,"index":0,"lookahead":"Grammar.END"},{"production":2,"index":0,"lookahead":"Grammar.END"},{"production":3,"index":0,"lookahead":"assign"}],"transitions":{"T":3,"V":4}},{"kernel":[{"production":0,"index":2,"lookahead":"Grammar.END"}],"items":[{"production":0,"index":2,"lookahead":"Grammar.END"}],"transitions":{}},{"kernel":[{"production":1,"index":1,"lookahead":"Grammar.END"}],"items":[{"production":1,"index":1,"lookahead":"Grammar.END"}],"transitions":{"assign":5}},{"kernel":[{"production":1,"index":2,"lookahead":"Grammar.END"}],"items":[{"production":1,"index":2,"lookahead":"Grammar.END"},{"production":4,"index":0,"lookahead":"Grammar.END"},{"production":5,"index":0,"lookahead":"Grammar.END"}],"transitions":{"E":6,"id":7,"num":8}},{"kernel":[{"production":1,"index":3,"lookahead":"Grammar.END"}],"items":[{"production":1,"index":3,"lookahead":"Grammar.END"}],"transitions":{}},{"kernel":[{"production":4,"index":1,"lookahead":"Grammar.END"}],"items":[{"production":4,"index":1,"lookahead":"Grammar.END"},{"production":3,"index":0,"lookahead":"Grammar.END"}],"transitions":{"V":9}},{"kernel":[{"production":5,"index":1,"lookahead":"Grammar.END"}],"items":[{"production":5,"index":1,"lookahead":"Grammar.END"}],"transitions":{}},{"kernel":[{"production":4,"index":2,"lookahead":"Grammar.END"}],"items":[{"production":4,"index":2,"lookahead":"Grammar.END"}],"transitions":{}}],
  "parsing.lr.lr1_table": [{"S":{"shift":1},"id":{"shift":2}},{"Grammar.END":{"reduce":[-1]}},{"T":{"shift":3},"V":{"shift":4},"Grammar.END":{"reduce":[2]},"assign":{"reduce":[3]}},{"Grammar.END":{"reduce":[0]}},{"assign":{"shift":5}},{"E":{"shift":6},"id":{"shift":7},"num":{"shift":8}},{"Grammar.END":{"reduce":[1]}},{"V":{"shift":9},"Grammar.END":{"reduce":[3]}},{"Grammar.END":{"reduce":[5]}},{"Grammar.END":{"reduce":[4]}}],
"parsing.lr.lalr1_automaton":[{"kernel":[{"production":-1,"index":0,"lookaheads":["Grammar.END"]}],"items":[{"production":-1,"index":0,"lookaheads":["Grammar.END"]},{"production":0,"index":0,"lookaheads":["Grammar.END"]}],"transitions":{"S":1,"id":2}},{"kernel":[{"production":-1,"index":1,"lookaheads":["Grammar.END"]}],"items":[{"production":-1,"index":1,"lookaheads":["Grammar.END"]}],"transitions":{}},{"kernel":[{"production":0,"index":1,"lookaheads":["Grammar.END"]}],"items":[{"production":0,"index":1,"lookaheads":["Grammar.END"]},{"production":1,"index":0,"lookaheads":["Grammar.END"]},{"production":2,"index":0,"lookaheads":["Grammar.END"]},{"production":3,"index":0,"lookaheads":["assign"]}],"transitions":{"T":3,"V":4}},{"kernel":[{"production":0,"index":2,"lookaheads":["Grammar.END"]}],"items":[{"production":0,"index":2,"lookaheads":["Grammar.END"]}],"transitions":{}},{"kernel":[{"production":1,"index":1,"lookaheads":["Grammar.END"]}],"items":[{"production":1,"index":1,"lookaheads":["Grammar.END"]}],"transitions":{"assign":5}},{"kernel":[{"production":1,"index":2,"lookaheads":["Grammar.END"]}],"items":[{"production":1,"index":2,"lookaheads":["Grammar.END"]},{"production":4,"index":0,"lookaheads":["Grammar.END"]},{"production":5,"index":0,"lookaheads":["Grammar.END"]}],"transitions":{"E":6,"id":7,"num":8}},{"kernel":[{"production":1,"index":3,"lookaheads":["Grammar.END"]}],"items":[{"production":1,"index":3,"lookaheads":["Grammar.END"]}],"transitions":{}},{"kernel":[{"production":4,"index":1,"lookaheads":["Grammar.END"]}],"items":[{"production":4,"index":1,"lookaheads":["Grammar.END"]},{"production":3,"index":0,"lookaheads":["Grammar.END"]}],"transitions":{"V":9}},{"kernel":[{"production":5,"index":1,"lookaheads":["Grammar.END"]}],"items":[{"production":5,"index":1,"lookaheads":["Grammar.END"]}],"transitions":{}},{"kernel":[{"production":4,"index":2,"lookaheads":["Grammar.END"]}],"items":[{"production":4,"index":2,"lookaheads":["Grammar.END"]}],"transitions":{}}],
  "parsing.lr.lalr1_table": [{"S":{"shift":1},"id":{"shift":2}},{"Grammar.END":{"reduce":[-1]}},{"T":{"shift":3},"V":{"shift":4},"Grammar.END":{"reduce":[2]},"assign":{"reduce":[3]}},{"Grammar.END":{"reduce":[0]}},{"assign":{"shift":5}},{"E":{"shift":6},"id":{"shift":7},"num":{"shift":8}},{"Grammar.END":{"reduce":[1]}},{"V":{"shift":9},"Grammar.END":{"reduce":[3]}},{"Grammar.END":{"reduce":[5]}},{"Grammar.END":{"reduce":[4]}}]
}
