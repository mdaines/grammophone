var Grammar = function() {
  
  // class
  
  function parse(spec) {
    
    var i, j;
    
    // Parser gives us rules in the following form:
    //
    //   { nt: "A", p: [["a", "b"], []] }
    //
    // We want an array of productions in this form:
    //
    //   [["A", "a", "b"], ["A"]]
    //
    // Note that depending on the grammar specification, productions
    // for a particular nonterminal may be at different places in the
    // list. We want to preserve the order in the user's input.
    
    var rules = Parser.parse(spec);
    var productions = [];
    
    for (i = 0; i < rules.length; i++) {
      for (j = 0; j < rules[i].p.length; j++) {
        productions.push([rules[i].nt].concat(rules[i].p[j]));
      }
    }
    
    return new klass(productions);
    
  }
  
  var END = "Grammar.END";
  
  // instance
  
  function initialize(productions) {
    
    // Check for reserved symbols (anything beginning with "Grammar.")
  
    var i, j;
  
    for (i = 0; i < productions.length; i++) {
      for (j = 0; j < productions[i].length; j++) {
      
        if (productions[i][j].match(/^Grammar\./))
          throw "Reserved symbol " + productions[i][j] + " cannot be part of a production";
      
      }
    }
  
    // Assign productions
  
    this.productions = productions;
    
    // Initialize calculations memoization
    
    this.calculations = {};
    
  }
  
  function calculate(name) {
    
    if (typeof Calculations[name] === "undefined")
      throw "Undefined grammar calculation " + name;

    if (typeof this.calculations[name] === "undefined")
      this.calculations[name] = Calculations[name](this);

    return this.calculations[name];
    
  }
  
  function getFirst(symbols) {
  
    var i, k;
    var s, t;
    var result;
    
    var first = this.calculate("grammar.first");
    var nullable = this.calculate("grammar.nullable");
    var terminals = this.calculate("grammar.terminals");
    var nonterminals = this.calculate("grammar.nonterminals");
  
    result = {};
  
    for (i = 0; i < symbols.length; i++) {
    
      s = symbols[i];
    
      if (s === END) {
      
        result[s] = true;
        break;
      
      } else if (terminals[s]) {
      
        result[s] = true;
        break;
      
      } else if (nonterminals[s]) {
      
        for (k in first[s])
          result[k] = true;
      
        if (!nullable[s])
          break;
      
      } else {
      
        throw "Unexpected symbol " + s;
      
      }
    
    }
  
    return result;
  
  }
  
  function isNullable(symbols) {
  
    var i;
    
    var nullable = this.calculate("grammar.nullable");
    var terminals = this.calculate("grammar.terminals");
    var nonterminals = this.calculate("grammar.nonterminals");
  
    for (i = 0; i < symbols.length; i++) {
    
      s = symbols[i];
    
      if (nonterminals[s]) {
      
        if (!nullable[s])
          return false;
      
      } else if (terminals[s]) {
      
        return false;
      
      } else {
      
        throw "Unexpected symbol " + s;
      
      }
    
    }
  
    return true;
  
  }
  
  // export
  
  var klass = initialize;
  
  klass.parse = parse;
  klass.END = END;
  
  klass.prototype.calculate = calculate;
  klass.prototype.getFirst = getFirst;
  klass.prototype.isNullable = isNullable;
  
  return klass;
  
}();
