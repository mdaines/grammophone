//= require templates/edit

EXAMPLES = {
  "assign": "S -> id T.\nT -> V assign E | .\nV -> .\nE -> id V | num .",
  "m grammar": "prog -> block.\nblock -> declarations program_body.\ndeclarations -> declaration SEMICOLON declarations |.\ndeclaration -> var_declaration | fun_declaration.\nvar_declaration -> VAR basic_var_declaration.\nbasic_var_declaration -> identifier COLON type.\nfun_declaration -> FUN identifier param_list COLON type CLPAR fun_block CRPAR.\nfun_block -> declarations fun_body.\nparam_list -> LPAR parameters RPAR.\nparameters -> parameters1 |.\nparameters1 -> parameters1 COMMA basic_var_declaration | basic_var_declaration.\nidentifier -> ID.\ntype -> INT | BOOL.\nprogram_body -> BEGIN prog_stmts END | prog_stmts.\nfun_body -> BEGIN prog_stmts RETURN expr SEMICOLON END | prog_stmts RETURN expr SEMICOLON.\nprog_stmts -> prog_stmt SEMICOLON prog_stmts |.\nprog_stmt -> IF expr THEN prog_stmt ELSE prog_stmt | WHILE expr DO prog_stmt | READ ID | ID ASSIGN expr | PRINT expr | CLPAR block CRPAR.\nexpr -> expr OR bint_term | bint_term.\nbint_term -> bint_term AND bint_factor | bint_factor.\nbint_factor -> NOT bint_factor | int_expr compare_op int_expr | int_expr.\ncompare_op -> EQUAL | LT | GT | LE |GE.\nint_expr -> int_expr addop int_term | int_term.\naddop -> ADD | SUB.\nint_term -> int_term mulop int_factor | int_factor.\nmulop -> MUL | DIV.\nint_factor -> LPAR expr RPAR | ID argument_list | NUM | BVAL | SUB int_factor.\nargument_list -> LPAR arguments RPAR |.\narguments -> arguments1 |.\narguments1 -> arguments1 COMMA expr | expr."
}

var EditView = function(element) {
  
  this._element = $(element);
  
}

EditView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

EditView.prototype.setup = function() {
  
  this._element.get(0).innerHTML = JST["templates/edit"]();
  
  var k;
  
  for (k in EXAMPLES)
    this._element.find(".examples select").append("<option>" + k + "</option>");
  
  this._element.find(".analyze").on("click", function() {
    this._delegate.specChanged(this._element.find(".spec").get(0).value);
  }.bind(this));
  
  this._element.find(".load-example").on("click", function() {
    this._delegate.specChanged(EXAMPLES[this._element.find(".examples select").get(0).value]);
  }.bind(this));
  
}

EditView.prototype.reload = function() {
  
  this._element.find(".spec").get(0).value = this._delegate.getSpec();
  
  var error = this._delegate.getError();
  
  if (error) {
    
    this._element.find(".errors").html("<pre>" + error + "</pre>").show();
    this._element.find(".errors").css({ top: this._element.find(".buttons").height() + "px" });
    this._element.find(".spec").css({ top: this._element.find(".buttons").height() + this._element.find(".errors").height() + "px" });
    this._element.find(".spec").css({ bottom: this._element.find(".examples").height() + "px" });
    
  } else {
    
    this._element.find(".errors").html("").hide();
    this._element.find(".spec").css({ top: this._element.find(".buttons").height() + "px" });
    this._element.find(".spec").css({ bottom: this._element.find(".examples").height() + "px" });
    
  }
  
}
