var Helpers = function() {
  
  // class
  
  function listSymbols(set, order) {
    
    var i;
    var result = [];
    
    for (i = 0; i < order.length; i++) {
      if (set[order[i]])
        result.push(order[i]);
    }
    
    if (set[Grammar.END])
      result.push(Grammar.END);
    
    return result;
    
  }
  
  function prettifySymbol(symbol) {
    
    return symbol.replace(/'/g, "&prime;");
    
  }
  
  function formatSymbol(symbol, info) {
    
    if (symbol == Grammar.END)
      return "<u>$</u>";
    else if (info.nonterminals[symbol])
      return "<i>" + prettifySymbol(escapeHTML(symbol)) + "</i>";
    else if (info.terminals[symbol])
      return "<b>" + prettifySymbol(escapeHTML(symbol)) + "</b>";
    else
      throw "Unknown symbol: " + symbol;
    
  }
  
  function bareFormatSymbol(symbol, info) {
    
    if (symbol == Grammar.END)
      return "$";
    else if (info.nonterminals[symbol] || info.terminals[symbol])
      return prettifySymbol(escapeHTML(symbol));
    else
      throw "Unknown symbol: " + symbol;
    
  }
  
  function formatSymbols(symbols, info) {
    
    var i;
    var result = [];
    
    for (i = 0; i < symbols.length; i++)
      result[i] = formatSymbol(symbols[i], info);
    
    return result;
    
  }
  
  function bareFormatSymbols(symbols, info) {
    
    var i;
    var result = [];
    
    for (i = 0; i < symbols.length; i++)
      result[i] = bareFormatSymbol(symbols[i], info);
    
    return result;
    
  }
  
  function formatProduction(production, info) {
    
    var result = "";
    var i;
    
    result += formatSymbol(production[0], info);
    result += " &rarr; ";
    
    if (production.length > 1)
      result += formatSymbols(production.slice(1), info).join(" ");
    else
      result += "<u>&epsilon;</u>";
    
    return result;
    
  }
  
  function formatSentence(strings) {
    
    if (strings.length == 0)
      return "";
    else if (strings.length == 1)
      return strings[0];
    else if (strings.length == 2)
      return strings.join(" and ");
    else
      return strings.slice(0, -1).concat("and " + strings[strings.length-1]).join(", ");
    
  }
  
  function formatItem(item, start, productions, info) {
    
    var production;

    if (item.production === -1) {
      
      if (item.index === 0)
        production = "&bull; " + Helpers.formatSymbol(start, info);
      else
        production = Helpers.formatSymbol(start, info) + " &bull;";
      
    } else {
      
      var symbols = Helpers.formatSymbols(productions[item.production].slice(1), info);
      symbols.splice(item.index, 0, "&bull;");
      
      production = Helpers.formatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
      
    }
    
    if (item.lookaheads)
      return "[" + production + ", " + Helpers.formatSymbols(item.lookaheads, info).join(" / ") + "]";
    else if (item.lookahead)
      return "[" + production + ", " + Helpers.formatSymbol(item.lookahead, info) + "]";
    else
      return production;
    
  }
  
  function bareFormatItem(item, start, productions, info) {
    
    var production;

    if (item.production === -1) {
      
      if (item.index === 0)
        production = "&bull; " + Helpers.bareFormatSymbol(start, info);
      else
        production = Helpers.bareFormatSymbol(start, info) + " &bull;";
      
    } else {
      
      var symbols = Helpers.bareFormatSymbols(productions[item.production].slice(1), info);
      symbols.splice(item.index, 0, "&bull;");
      
      production = Helpers.bareFormatSymbol(productions[item.production][0], info) + " &rarr; " + symbols.join(" ");
      
    }
    
    if (item.lookaheads)
      return "[" + production + ", " + Helpers.bareFormatSymbols(item.lookaheads, info).join(" / ") + "]";
    else if (item.lookahead)
      return "[" + production + ", " + Helpers.bareFormatSymbol(item.lookahead, info) + "]";
    else
      return production;
    
  }
  
  var TRANSFORMATION_FORMATTERS = {
    expand: function(transformation, productions, info) {
      return "Expand Nonterminal";
    },
    
    removeImmediateLeftRecursion: function(transformation, productions, info) {
      return "Remove Immediate Left Recursion";
        
    },
    
    leftFactor: function(transformation, productions, info) {
      return "Left Factor " +
        bareFormatSymbols(productions[transformation.production].slice(1, transformation.length + 1), info).join(" ");
    },
    
    epsilonSeparate: function(transformation, productions, info) {
      return "Epsilon-Separate";
    },
    
    removeUnreachable: function(transformation, productions, info) {
      return "Remove Unreachable Nonterminal"
    }
  }
  
  function formatTransformation(transformation, productions, info) {
    
    return TRANSFORMATION_FORMATTERS[transformation.name](transformation, productions, info) || transformation.name;
    
  }
  
  function repeatString(string, times) {
    
    var result = "";
    var i;
    
    for (i = 0; i < times; i++)
      result += string;
      
    return result;
    
  }
  
  // From Prototype
  
  function escapeHTML(string) {
    
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
    
  }
  
  // application delegate
  
  function setDelegate(delegate) {
    
    this._delegate = delegate;
    
  }
  
  function buildHref(path, fragment) {
    
    return this._delegate.buildHref(path, fragment);
    
  }
  
  // export
  
  var klass = {};
  
  klass.listSymbols = listSymbols;
  klass.formatSymbol = formatSymbol;
  klass.bareFormatSymbol = bareFormatSymbol;
  klass.formatSymbols = formatSymbols;
  klass.bareFormatSymbols = bareFormatSymbols;
  klass.formatProduction = formatProduction;
  klass.formatSentence = formatSentence;
  klass.formatItem = formatItem;
  klass.bareFormatItem = bareFormatItem;
  klass.formatTransformation = formatTransformation;
  klass.repeatString = repeatString;
  klass.escapeHTML = escapeHTML;
  klass.setDelegate = setDelegate;
  klass.buildHref = buildHref;
  
  return klass;
  
}();
var Set = {
  
  count: function(set) {
    
    var n;
    var result = 0;
    
    for (n in set)
      result++;
      
    return result;
    
  },
  
  any: function(set) {
    
    var n;
    
    for (n in set)
      return true;
    
    return false;
    
  },
  
  intersection: function(a, b) {
    
    var result = {};
    var k;
    
    for (k in a) {
      if (b[k])
        result[k] = true;
    }
    
    return result;
    
  }
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/header"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');  if (path.length > 0) { ; __p.push('\n  <nav>\n    ',  path.map(function(p) {
        if (p.path) {
          return "<a href=\"" + Helpers.buildHref(p.path, p.fragment) + "\">" + p.title + "</a>";
        } else {
          return p.title;
        }
      }).map(function(p, i, a) {
        if (i === a.length - 1)
          return "<b>" + p + "</b>";
        else
          return p;
      }).join(" / ") ,'\n  </nav>\n');  } ; __p.push('\n');}return __p.join('');};
}).call(this);

var HeaderView = function(element) {
  
  this._element = element;
  this._element.className = "header";
  
}

HeaderView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

HeaderView.prototype.reload = function() {
  
  var path = this._delegate.getPathComponents();
  
  this._element.innerHTML = JST["templates/header"]({ path: path });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/blank_slate"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<section>\n  <p><b>Grammophone</b> is a tool for analyzing and transforming context-free grammars. To start, type a grammar in the box to the left and click Analyze or Transform.</p>\n  \n  <p>Grammars are written like this:</p>\n  \n  <pre>S -> a S b .\nS -> .</pre>\n\n  <p>This grammar generates the language a<sup>n</sup>&nbsp;b<sup>n</sup>, where n&nbsp;≥&nbsp;0.</p>\n        \n</section>\n');}return __p.join('');};
}).call(this);

var BlankSlateView = function(element) {
  
  this._element = element;
  this._element.className = "blank-slate";
  
}

BlankSlateView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

BlankSlateView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/blank_slate"]({});
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/sanity"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<h1>Sanity Checks</h1>\n\n<ul class="symbols">\n  <li>\n    ');  if (Set.any(unreachable)) { ; __p.push('\n      The grammar has unreachable nonterminals:\n      ',  Helpers.formatSentence(Helpers.formatSymbols(Helpers.listSymbols(unreachable, info.productionOrder), info)) ,'.\n    ');  } else { ; __p.push('\n      All nonterminals are reachable.\n    ');  } ; __p.push('\n  </li>\n  \n  <li>\n    ');  if (Set.any(unrealizable)) { ; __p.push('\n      The grammar has unrealizable nonterminals:\n      ',  Helpers.formatSentence(Helpers.formatSymbols(Helpers.listSymbols(unrealizable, info.productionOrder), info)) ,'.\n    ');  } else { ; __p.push('\n      All nonterminals are realizable.\n    ');  } ; __p.push('\n  </li>\n  \n  <li>\n    ');  if (typeof cycle !== "undefined") { ; __p.push('\n      The grammar is cyclic:\n      ',  Helpers.formatSymbols(cycle, info).join(" &rArr; ") ,' is a cycle.\n    ');  } else { ; __p.push('\n      The grammar contains no cycles.\n    ');  } ; __p.push('\n  </li>\n  \n  <li>\n    ');  if (nullAmbiguity.length > 0) { ; __p.push('\n      The grammar contains a null ambiguity:\n      ',  Helpers.formatProduction(productions[nullAmbiguity[0]], info) ,'\n      and\n      ',  Helpers.formatProduction(productions[nullAmbiguity[1]], info) ,'\n      are ambiguously nullable.\n    ');  } else { ; __p.push('\n      The grammar is null unambiguous.\n    ');  } ; __p.push('\n  </li>\n  \n  ');  if (typeof ambiguous !== "undefined") { ; __p.push('\n    <li>\n      The grammar is ambiguous: the sentence\n      ');  if (ambiguous.length === 0) { ; __p.push('\n        <u>&epsilon;</u>\n      ');  } else { ; __p.push('\n        ',  Helpers.formatSymbols(ambiguous, info).join(" ") ,'\n      ');  } ; __p.push('\n      has an ambiguous derivation.\n    </li>\n  ');  } ; __p.push('\n</ul>\n');}return __p.join('');};
}).call(this);

var SanityView = function(element) {
  
  this._element = element;
  
}

SanityView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SanityView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/sanity"]({
    unreachable: this._delegate.getCalculation("grammar.unreachable"),
    unrealizable: this._delegate.getCalculation("grammar.unrealizable"),
    cycle: this._delegate.getCalculation("grammar.cycle"),
    nullAmbiguity: this._delegate.getCalculation("grammar.nullAmbiguity"),
    ambiguous: this._delegate.getCalculation("grammar.ambiguous"),
    productions: this._delegate.getCalculation("grammar.productions"),
    info: this._delegate.getCalculation("grammar.symbolInfo")
  });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/sentences"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<h1>Example Sentences</h1>\n\n');  if (sentences.length > 0) { ; __p.push('\n  <ul class="symbols">\n    ');  sentences.forEach(function(sentence) { ; __p.push('\n      <li>',  sentence.length === 0 ? "<u>&epsilon;</u>" : Helpers.formatSymbols(sentence, info).join(" ") ,'</li>\n    ');  }); ; __p.push('\n  </ul>\n  \n  ');  if (more) { ; __p.push('\n    <p><a href="',  Helpers.buildHref("/sentences") ,'">More example sentences</a></p>\n  ');  } ; __p.push('\n');  } else { ; __p.push('\n  <p>No example sentences could be generated.</p>\n');  } ; __p.push('');}return __p.join('');};
}).call(this);

var SentencesView = function(element) {
  
  this._element = element;
  
}

SentencesView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SentencesView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/sentences"]({
    sentences: this._delegate.getCalculation("grammar.sentences"),
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    more: false
  });
  
};

var ShortSentencesView = function(element) {
  
  this._element = element;
  
}

ShortSentencesView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ShortSentencesView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/sentences"]({
    sentences: this._delegate.getCalculation("grammar.sentences").slice(0, 10),
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    more: this._delegate.getCalculation("grammar.sentences").length > 10
  });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/nonterminals"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<h1>Nonterminals</h1>\n\n<table class="symbols">\n  <tr>\n    <th>Symbol</th>\n    <th>Nullable?</th>\n    <th>Endable?</th>\n    <th>First set</th>\n    <th>Follow set</th>\n  </tr>\n  ');  info.productionOrder.forEach(function(symbol) { ; __p.push('\n    <tr>\n      <td>',  Helpers.formatSymbol(symbol, info) ,'</td>\n      <td>',  nullable[symbol] ? "Nullable" : "" ,'</td>\n      <td>',  endable[symbol] ? "Endable" : "" ,'</td>\n      <td>',  Helpers.formatSymbols(Helpers.listSymbols(first[symbol] || {}, info.terminalOrder), info).join(", ") ,'</td>\n      <td>',  Helpers.formatSymbols(Helpers.listSymbols(follow[symbol] || {}, info.terminalOrder), info).join(", ") ,'</td>\n    </tr>\n  ');  }); ; __p.push('\n</table>\n');}return __p.join('');};
}).call(this);

var NonterminalsView = function(element) {
  
  this._element = element;
  
}

NonterminalsView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

NonterminalsView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/nonterminals"]({
    nullable: this._delegate.getCalculation("grammar.nullable"),
    endable: this._delegate.getCalculation("grammar.endable"),
    first: this._delegate.getCalculation("grammar.first"),
    follow: this._delegate.getCalculation("grammar.follow"),
    info: this._delegate.getCalculation("grammar.symbolInfo")
  });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/parsing"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(''); 
    function formatClassification(cs, c, n) {
      if (cs[c].member)
        return "The grammar is " + n + ".";
      else
        return "<span class=\"conflict\">Not " + n + " &mdash; " + cs[c].reason + ".</span></td>";
    }
  ; __p.push('\n\n<h1>Parsing Algorithms</h1>\n\n<table class="parsing-algorithm-table">\n  <tr>\n    <th scope="row">LL(1)</th>\n    <td class="classification">\n      ',  formatClassification(classification, "ll1", "LL(1)") ,'\n    </td>\n    <td>\n      <a href="',  Helpers.buildHref("/ll1-table") ,'">Parsing table</a>\n    </td>\n  </tr>\n  \n  <tr>\n    <th scope="row">LR(0)</th>\n    <td class="classification">\n      ',  formatClassification(classification, "lr0", "LR(0)") ,'\n    </td>\n    <td>\n      <a href="',  Helpers.buildHref("/lr0-automaton") ,'">Automaton</a>,\n      <a href="',  Helpers.buildHref("/lr0-table") ,'">Parsing table</a>\n    </td>\n  </tr>\n  \n  <tr>\n    <th scope="row">SLR(1)</th>\n    <td class="classification">\n      ',  formatClassification(classification, "slr1", "SLR(1)") ,'\n    </td>\n    <td><a href="',  Helpers.buildHref("/slr1-table") ,'">Parsing table</a></td>\n  </tr>\n  \n  <tr>\n    <th scope="row">LR(1)</th>\n    <td class="classification">\n      ',  formatClassification(classification, "lr1", "LR(1)") ,'\n    </td>\n    <td>\n      <a href="',  Helpers.buildHref("/lr1-automaton") ,'">Automaton</a>,\n      <a href="',  Helpers.buildHref("/lr1-table") ,'">Parsing table</a>\n    </td>\n  </tr>\n  \n  <tr>\n    <th scope="row">LALR(1)</th>\n    <td class="classification">\n      ',  formatClassification(classification, "lalr1", "LALR(1)") ,'\n    </td>\n    <td>\n      <a href="',  Helpers.buildHref("/lalr1-automaton") ,'">Automaton</a>,\n      <a href="',  Helpers.buildHref("/lalr1-table") ,'">Parsing table</a>\n    </td>\n  </tr>\n</table>\n');}return __p.join('');};
}).call(this);

var ParsingView = function(element) {
  
  this._element = element;
  
}

ParsingView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ParsingView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/parsing"]({
    classification: this._delegate.getCalculation("grammar.classification")
  });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/ll1_table"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<table class="symbols ll1-table">\n  <colgroup>\n    <col>\n  </colgroup>\n  <colgroup class="t">\n    ',  Helpers.repeatString("<col>", Set.count(info.terminals) + 1) ,'\n  </colgroup>\n  \n  <tr>\n    <th></th>\n    ');  info.terminalOrder.forEach(function(symbol) { ; __p.push('\n      <th>',  Helpers.formatSymbol(symbol, info) ,'</th>\n    ');  }) ; __p.push('\n    <th>',  Helpers.formatSymbol(Grammar.END, info) ,'</th>\n  </tr>\n  \n  ');  info.productionOrder.forEach(function(nt) { ; __p.push('\n    <tr>\n      <th scope="row">',  Helpers.formatSymbol(nt, info) ,'</th>\n      ');  info.terminalOrder.concat(Grammar.END).forEach(function(t) { ; __p.push('\n        ');  if (typeof table[nt][t] !== "undefined") { ; __p.push('\n          <td class="',  table[nt][t].length > 1 ? "conflict" : "" ,'">\n            <ul>\n              ');  table[nt][t].forEach(function(p) { ; __p.push('\n                <li>',  Helpers.formatProduction(productions[p], info) ,'\n              ');  }) ; __p.push('\n            </ul>\n          </td>\n        ');  } else { ; __p.push('\n          <td></td>\n        ');  } ; __p.push('\n      ');  }) ; __p.push('\n    </tr>\n  ');  }) ; __p.push('\n</table>\n');}return __p.join('');};
}).call(this);

var LL1TableView = function(element) {
  
  this._element = element;
  
}

LL1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LL1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/ll1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.ll.ll1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/lr_automaton_graph"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('digraph "',  title ,'" {\n  \n  graph [rankdir=LR];\n  node [shape=record];\n  \n  ');  automaton.forEach(function(state, index) { ; __p.push('\n    s',  index ,' [label="',  index ,' | ',  state.items.map(function(item) { return Helpers.bareFormatItem(item, start, productions, info); }).join("\\n") ,'"];\n  ');  }); ; __p.push('\n  \n  ');  automaton.forEach(function(state, index) { ; __p.push('\n    ');  var s; ; __p.push('\n    ');  for (s in state.transitions) { ; __p.push('\n      s',  index ,' -> s',  state.transitions[s] ,' [label="',  Helpers.escapeHTML(s) ,'"];\n    ');  } ; __p.push('\n  ');  }); ; __p.push('\n  \n}\n');}return __p.join('');};
}).call(this);

var LR0AutomatonView = function(element) {
  
  this._element = element;
  
}

LR0AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR0AutomatonView.prototype.reload = function() {
  
  var dot = JST["templates/lr_automaton_graph"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lr0_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start"),
    title: "LR(0) Automaton"
  });
  
  this._element.innerHTML = Viz(dot);
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/lr0_table"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<table class="symbols lr0-table">\n  <colgroup>\n    <col>\n  </colgroup>\n  <colgroup class="t">\n    ',  Helpers.repeatString("<col>", Set.count(info.terminals)) ,'\n  </colgroup>\n  <colgroup class="nt">\n    ',  Helpers.repeatString("<col>", Set.count(info.nonterminals)) ,'\n  </colgroup>\n  \n  <tr>\n    <th>State</th>\n    ');  info.terminalOrder.forEach(function(symbol) { ; __p.push('\n      <th>',  Helpers.formatSymbol(symbol, info) ,'</th>\n    ');  }) ; __p.push('\n    ');  info.nonterminalOrder.forEach(function(symbol) { ; __p.push('\n      <th>',  Helpers.formatSymbol(symbol, info) ,'</th>\n    ');  }) ; __p.push('\n  </tr>\n  \n  ');  table.forEach(function(state, index) { ; __p.push('\n    <tr>\n      <th scope="row">',  index ,'</td>\n      ');  info.terminalOrder.forEach(function(s) { ; __p.push('\n        <td class="',  (typeof state.shift[s] === "undefined" ? 0 : 1) + state.reduce.length > 1 ? "conflict" : "" ,'">\n          <ul>\n            ');  if (typeof state.shift[s] !== "undefined") { ; __p.push('\n              <li>shift(',  state.shift[s] ,')</li>\n            ');  } ; __p.push('\n            ');  state.reduce.forEach(function(p) { ; __p.push('\n              ');  if (p === -1) { ; __p.push('\n                <li>accept</li>\n              ');  } else { ; __p.push('\n                <li>reduce(',  Helpers.formatProduction(productions[p], info) ,')</li>\n              ');  } ; __p.push('\n            ');  }) ; __p.push('\n          </ul>\n        </td>\n      ');  }) ; __p.push('\n      ');  info.nonterminalOrder.forEach(function(s) { ; __p.push('\n        <td>\n          <ul>\n            ');  if (typeof state.shift[s] !== "undefined") { ; __p.push('\n              <li>',  state.shift[s] ,'</li>\n            ');  } ; __p.push('\n          </ul>\n        </td>\n      ');  }) ; __p.push('\n    </tr>\n  ');  }) ; __p.push('\n</table>\n');}return __p.join('');};
}).call(this);

var LR0TableView = function(element) {
  
  this._element = element;
  
}

LR0TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR0TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr0_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    start: this._delegate.getCalculation("grammar.start"),
    automaton: this._delegate.getCalculation("parsing.lr.lr0_automaton"),
    table: this._delegate.getCalculation("parsing.lr.lr0_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/lr1_table"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<table class="symbols lr1-table">\n  <colgroup>\n    <col>\n  </colgroup>\n  <colgroup class="t">\n    ',  Helpers.repeatString("<col>", Set.count(info.terminals) + 1) ,'\n  </colgroup>\n  <colgroup class="nt">\n    ',  Helpers.repeatString("<col>", Set.count(info.nonterminals)) ,'\n  </colgroup>\n  \n  <tr>\n    <th>State</th>\n    ');  info.terminalOrder.forEach(function(symbol) { ; __p.push('\n      <th>',  Helpers.formatSymbol(symbol, info) ,'</th>\n    ');  }) ; __p.push('\n    <th>',  Helpers.formatSymbol(Grammar.END, info) ,'</th>\n    ');  info.nonterminalOrder.forEach(function(symbol) { ; __p.push('\n      <th>',  Helpers.formatSymbol(symbol, info) ,'</th>\n    ');  }) ; __p.push('\n  </tr>\n  \n  ');  table.forEach(function(state, index) { ; __p.push('\n    <tr>\n      <th scope="row">',  index ,'</td>\n      ');  info.terminalOrder.concat(Grammar.END).forEach(function(s) { ; __p.push('\n        ');  if (typeof state[s] === "undefined") { print("<td></td>"); return; } ; __p.push('\n        \n        <td class="',  (typeof state[s].shift === "undefined" ? 0 : 1) + (typeof state[s].reduce !== "undefined" ? state[s].reduce.length : 0) > 1 ? "conflict" : "" ,'">\n          <ul>\n            ');  if (typeof state[s].shift !== "undefined") { ; __p.push('\n              <li>shift(',  state[s].shift ,')</li>\n            ');  } ; __p.push('\n            ');  if (typeof state[s].reduce !== "undefined") { ; __p.push('\n              ');  state[s].reduce.forEach(function(p) { ; __p.push('\n                ');  if (p === -1) { ; __p.push('\n                  <li>accept</li>\n                ');  } else { ; __p.push('\n                  <li>reduce(',  Helpers.formatProduction(productions[p], info) ,')</li>\n                ');  } ; __p.push('\n              ');  }) ; __p.push('\n            ');  } ; __p.push('\n          </ul>\n        </td>\n      ');  }) ; __p.push('\n      ');  info.nonterminalOrder.forEach(function(s) { ; __p.push('\n        ');  if (typeof state[s] === "undefined") { print("<td></td>"); return; } ; __p.push('\n        \n        <td>\n          <ul>\n            ');  if (typeof state[s].shift !== "undefined") { ; __p.push('\n              <li>',  state[s].shift ,'</li>\n            ');  } ; __p.push('\n          </ul>\n        </td>\n      ');  }) ; __p.push('\n    </tr>\n  ');  }) ; __p.push('\n</table>\n');}return __p.join('');};
}).call(this);

var SLR1TableView = function(element) {
  
  this._element = element;
  
}

SLR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

SLR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.slr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
};

var LR1AutomatonView = function(element) {
  
  this._element = element;
  
}

LR1AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR1AutomatonView.prototype.reload = function() {
  
  var dot = JST["templates/lr_automaton_graph"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lr1_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start"),
    title: "LR(1) Automaton"
  });
  
  this._element.innerHTML = Viz(dot);
  
};

var LR1TableView = function(element) {
  
  this._element = element;
  
}

LR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.lr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
};

var LALR1AutomatonView = function(element) {
  
  this._element = element;
  
}

LALR1AutomatonView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LALR1AutomatonView.prototype.reload = function() {
  
  var dot = JST["templates/lr_automaton_graph"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    automaton: this._delegate.getCalculation("parsing.lr.lalr1_automaton"),
    productions: this._delegate.getCalculation("grammar.productions"),
    start: this._delegate.getCalculation("grammar.start"),
    title: "LALR(1) Automaton"
  });
  
  this._element.innerHTML = Viz(dot);
  
};

var LALR1TableView = function(element) {
  
  this._element = element;
  
}

LALR1TableView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

LALR1TableView.prototype.reload = function() {
  
  this._element.innerHTML = JST["templates/lr1_table"]({
    info: this._delegate.getCalculation("grammar.symbolInfo"),
    table: this._delegate.getCalculation("parsing.lr.lalr1_table"),
    productions: this._delegate.getCalculation("grammar.productions")
  });
  
};
















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
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/edit"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="spec-wrap">\n  <textarea class="spec"></textarea>\n</div>\n');}return __p.join('');};
}).call(this);

var EditController = function(element) {
  
  this._element = element;
  this._element.id = "edit";
  
  this._element.innerHTML = JST["templates/edit"]();
  
}

EditController.prototype.getSpec = function() {
  
  return this._element.querySelector(".spec").value;
  
}

EditController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

EditController.prototype.reload = function() {
  
  this._element.querySelector(".spec").value = this._delegate.getSpec();
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/transform"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="buttons">\n  ');  if (typeof undoTransformation !== "undefined") { ; __p.push('\n    <button data-action="undo" class="undo">Undo ',  Helpers.formatTransformation(undoTransformation, productions, info) ,'</button>\n  ');  } ; __p.push('\n  \n  ');  if (typeof redoTransformation !== "undefined") { ; __p.push('\n    <button data-action="redo" class="redo">Redo ',  Helpers.formatTransformation(redoTransformation, productions, info) ,'</button>\n  ');  } ; __p.push('\n</div>\n\n<table class="symbols productions">\n  ');  productions.forEach(function(production, i) { ; __p.push('\n    <tr>\n      <td>\n        ');  production.forEach(function(symbol, j) { ; __p.push('\n          ');  if (transformations[i][j].length > 0) { ; __p.push('\n            <span class="pill">',  Helpers.formatSymbol(symbol, info) ,'<select><option disabled selected>',  symbol ,'</option>');  transformations[i][j].forEach(function(t) { ; __p.push('<option value="',  t.index ,'">',  Helpers.formatTransformation(t.transformation, productions, info) ,'</option>');  }) ; __p.push('</select></span>\n          ');  } else { ; __p.push('\n            ',  Helpers.formatSymbol(symbol, info) ,'\n          ');  } ; __p.push('\n          ');  if (j === 0) { ; __p.push('\n            &rarr;\n          ');  } ; __p.push('\n        ');  }) ; __p.push('\n        ');  if (production.length === 1) { ; __p.push('\n          <u>&epsilon;</u>\n        ');  } ; __p.push('\n      </td>\n    </tr>\n  ');  }); ; __p.push('\n</table>\n');}return __p.join('');};
}).call(this);

var TransformView = function(element) {
  
  this._element = element;
  
}

TransformView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

TransformView.prototype.setup = function() {
  
  this._element.addEventListener("click", function(e) {
    
    if (e.target.dataset.action === "undo")
      this._delegate.undo();
    else if (e.target.dataset.action === "redo")
      this._delegate.redo();
    
  }.bind(this));
  
  this._element.addEventListener("change", function(e) {
    
    var index = parseInt(e.target.value);
    this._delegate.transform(this._transformations[index]);
    
  }.bind(this));
  
}

TransformView.prototype.reload = function() {
  
  var productions = this._delegate.getProductions();
  var info = this._delegate.getSymbolInfo();
  
  this._transformations = this._delegate.getTransformations();
  
  var transformations = [];
  var i, j;
  
  for (i = 0; i < productions.length; i++) {
    transformations[i] = [];
    for (j = 0; j < productions[i].length; j++) {
      transformations[i][j] = [];
    }
  }
  
  var transformation;
  
  for (i = 0; i < this._transformations.length; i++) {
    transformation = this._transformations[i];
    transformations[transformation.production][transformation.symbol].push({
      index: i,
      transformation: transformation
    });
  }
  
  this._element.innerHTML = JST["templates/transform"]({
    productions: productions,
    info: info,
    previousInfo: this._delegate.getPreviousSymbolInfo(),
    transformations: transformations,
    undoTransformation: this._delegate.getUndoTransformation(),
    redoTransformation: this._delegate.getRedoTransformation()
  });
  
};

var TransformController = function(element) {
  
  this._element = element;
  this._element.id = "transform";
  
  this._transformElement = document.createElement("article");
  this._element.appendChild(this._transformElement);
  
  this._transformView = new TransformView(this._transformElement);
  this._transformView.setDelegate(this);
  
  if (this._transformView.setup)
    this._transformView.setup();
  
}

TransformController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

TransformController.prototype.reload = function() {
  
  this._index = 0;
  this._stack = [ { grammar: this._delegate.getGrammar() } ];
  
  this._transformView.reload();
  
}

TransformController.prototype.getProductions = function() {
  
  return this._stack[this._index].grammar.productions;
  
}

TransformController.prototype.getSymbolInfo = function() {
  
  return this._stack[this._index].grammar.calculate("grammar.symbolInfo");
  
}

TransformController.prototype.getPreviousSymbolInfo = function() {
  
  if (this._index > 0)
    return this._stack[this._index - 1].grammar.calculate("grammar.symbolInfo");
  
}

TransformController.prototype.getTransformations = function(productionIndex, symbolIndex) {
  
  return this._stack[this._index].grammar.calculate("transformations");
  
}

TransformController.prototype.getUndoTransformation = function() {
  
  if (this._index > 0)
    return this._stack[this._index].transformation;
  
}

TransformController.prototype.getRedoTransformation = function() {
  
  if (this._index < this._stack.length - 1)
    return this._stack[this._index + 1].transformation;
  
}

TransformController.prototype.undo = function() {
  
  if (this._index > 0)
    this._index--;
  
  this._transformView.reload();
  
  this._delegate.grammarChanged(this._stack[this._index].grammar);
  
}

TransformController.prototype.redo = function() {
  
  if (this._index < this._stack.length - 1)
    this._index++;
  
  this._transformView.reload();
  
  this._delegate.grammarChanged(this._stack[this._index].grammar);
  
}

TransformController.prototype.transform = function(transformation) {
  
  var item = {
    grammar: this._stack[this._index].grammar.transform(transformation),
    transformation: transformation
  };
  
  this._index++;
  this._stack.splice(this._index, this._stack.length - this._index, item);
  
  this._transformView.reload();
  
  this._delegate.grammarChanged(this._stack[this._index].grammar);
  
};
(function() { this.JST || (this.JST = {}); this.JST["templates/mode"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<input type="radio" id="mode-edit" name="mode" value="edit" checked><label for="mode-edit" class="left">Edit</label><input type="radio" id="mode-transform" name="mode" value="transform"><label for="mode-transform" class="right">Transform</label>\n<button id="mode-analyze">Analyze</button>');}return __p.join('');};
}).call(this);

var ModeController = function(element) {
  
  this._element = element;
  this._element.id = "mode";
  
  this._element.innerHTML = JST["templates/mode"]();
  
  this._element.querySelector("#mode-edit").addEventListener("change", function(e) {
    if (e.target.checked)
      this._delegate.edit();
  }.bind(this));
  
  this._element.querySelector("#mode-transform").addEventListener("change", function(e) {
    if (e.target.checked)
      this._delegate.transform();
  }.bind(this));
  
  this._element.querySelector("#mode-analyze").addEventListener("click", function(e) {
    this._delegate.analyze();
  }.bind(this));
  
}

ModeController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ModeController.prototype.reload = function() {
  
  var mode = this._delegate.getMode();
  
  if (mode === "edit") {
    
    this._element.querySelector("#mode-edit").checked = true;
    this._element.querySelector("#mode-analyze").disabled = false;
    
  } else {
    
    this._element.querySelector("#mode-transform").checked = true;
    this._element.querySelector("#mode-analyze").disabled = true;
    
  }
  
};
var ErrorController = function(element) {
  
  this._element = element;
  this._element.id = "error";
  
}

ErrorController.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

ErrorController.prototype.reload = function() {
  
  var error = this._delegate.getError();
  
  if (typeof error !== "undefined")
    this._element.innerHTML = "<pre>" + this._delegate.getError() + "</pre>";
  else
    this._element.innerHTML = "";
  
};







Function.prototype.bind = function(context) {
  var fn = this;
  return function() { return fn.apply(context, arguments); };
}

Function.prototype.defer = function() {
  setTimeout(this, 0);
}

var ApplicationController = function(element) {
  
  this._element = element;
  
  // helpers
  
  Helpers.setDelegate(this);
  
  // master
  
  this._masterElement = document.createElement("div");
  this._masterElement.id = "master";
  this._element.appendChild(this._masterElement);
  
  // edit
  
  this._editElement = document.createElement("section");
  this._masterElement.appendChild(this._editElement);
  
  this._editController = new EditController(this._editElement);
  this._editController.setDelegate(this);
  
  // mode
  
  this._modeElement = document.createElement("section");
  this._masterElement.appendChild(this._modeElement);
  
  this._modeController = new ModeController(this._modeElement);
  this._modeController.setDelegate(this);
  
  // error
  
  this._errorElement = document.createElement("section");
  this._masterElement.appendChild(this._errorElement);
  
  this._errorController = new ErrorController(this._errorElement);
  this._errorController.setDelegate(this);
  
  // transform
  
  this._transformElement = document.createElement("section");
  this._masterElement.appendChild(this._transformElement);
  
  this._transformController = new TransformController(this._transformElement);
  this._transformController.setDelegate(this);
  
  // analysis
  
  this._analysisElement = document.createElement("section");
  this._element.appendChild(this._analysisElement);
  
  this._analysisController = new AnalysisController(this._analysisElement);
  this._analysisController.setDelegate(this);
  
  // listen for hashchange events
  
  window.location.hash = "";
  
  window.addEventListener("hashchange", function() {
    this._hashChanged();
  }.bind(this), false);
  
  // set initial path and parse, and reload children
  
  this._path = "/";
  this._parse = { spec: "# Type a grammar here:\n\n" };
  this._mode = "edit";
  
  this._analysisController.reload();
  this._editController.reload();
  this._modeController.reload();
  
  if (this._mode === "edit")
    this._errorController.reload();
  else
    this._transformController.reload();
  
  this._layout();
  
}

ApplicationController.prototype._hashChanged = function() {
  
  // get grammar and path
  
  this._path = window.location.hash.slice(1);
  
  if (this._path == "")
    this._path = "/";
  
  // update controllers
  
  this._analysisController.reload();
  
}

ApplicationController.prototype._layout = function() {
  
  if (this._mode === "edit") {
    
    this._editElement.style.display = '';
    this._transformElement.style.display = 'none';
  
    if (typeof this._parse.error === "undefined") {
    
      this._errorElement.style.display = 'none';
      this._editElement.style.top = this._modeElement.offsetHeight + "px";
    
    } else {
    
      this._errorElement.style.display = '';
      this._errorElement.style.top = this._modeElement.offsetHeight + "px";
      this._editElement.style.top = (this._modeElement.offsetHeight + this._errorElement.offsetHeight) + "px";
    
    }
    
  } else {
    
    this._editElement.style.display = 'none';
    this._errorElement.style.display = 'none';
    this._transformElement.style.display = '';
  
    this._transformElement.style.top = this._modeElement.offsetHeight + "px";
    
  }
  
}

ApplicationController.prototype.getPath = function() {
  
  return this._path;
  
}

ApplicationController.prototype.getGrammar = function() {
  
  return this._parse.grammar;
  
}

ApplicationController.prototype.getSpec = function() {
  
  return this._parse.spec;
  
}

ApplicationController.prototype.getError = function() {
  
  return this._parse.error;
  
}

ApplicationController.prototype.getMode = function() {
  
  return this._mode;
  
}

ApplicationController.prototype.grammarChanged = function(grammar) {
  
  this._parse = { grammar: grammar, spec: grammar.toString() };
  
  this._analysisController.reload();
  this._layout();
  
}

ApplicationController.prototype.analyze = function() {
  
  this._parse = Grammar.parse(this._editController.getSpec());
  
  if (typeof this._parse.error === "undefined")
    this._analysisController.reload();
  
  this._errorController.reload();
  this._layout();
  
}

ApplicationController.prototype.transform = function() {
  
  this._parse = Grammar.parse(this._editController.getSpec());
  
  if (typeof this._parse.error === "undefined" && typeof this._parse.grammar !== "undefined") {
    this._mode = "transform";
    this._transformController.reload();
  }
  
  this._analysisController.reload();
  this._errorController.reload();
  this._modeController.reload();
  this._layout();
  
}

ApplicationController.prototype.edit = function() {
  
  this._mode = "edit";
  
  this._analysisController.reload();
  this._editController.reload();
  this._modeController.reload();
  this._layout();
  
}

ApplicationController.prototype.buildHref = function(path) {
  
  return "#" + path;
  
};


