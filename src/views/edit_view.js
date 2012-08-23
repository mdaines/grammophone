//= require templates/edit

var EditView = function(element) {
  
  this._element = $(element);
  
}

EditView.prototype.setDelegate = function(delegate) {
  
  this._delegate = delegate;
  
}

EditView.prototype.setup = function() {
  
  this._element.get(0).innerHTML = JST["templates/edit"]();
  
  var k;
  
  for (k in EditView.EXAMPLES)
    this._element.find(".examples select").append("<option>" + k + "</option>");
  
  this._element.find(".analyze").on("click", function() {
    this._delegate.specChanged(this._element.find(".spec").get(0).value);
  }.bind(this));
  
  this._element.find(".load-example").on("click", function() {
    this._delegate.specChanged(EditView.EXAMPLES[this._element.find(".examples select").get(0).value]);
  }.bind(this));
  
}

EditView.prototype.reload = function() {
  
  this._element.find(".spec").get(0).value = this._delegate.getSpec();
  
  var error = this._delegate.getError();
  
  if (error) {
    
    this._element.find(".errors").html("<pre>" + error + "</pre>").show();
    this._element.find(".errors").css({ top: this._element.find(".buttons").height() + "px" });
    
    this._element.find(".spec-wrap").css({ top: this._element.find(".buttons").height() + this._element.find(".errors").height() + "px" });
    this._element.find(".spec-wrap").css({ bottom: this._element.find(".examples").height() + 20 + "px" });
    
  } else {
    
    this._element.find(".errors").html("").hide();
    
    this._element.find(".spec-wrap").css({ top: this._element.find(".buttons").height() + "px" });
    this._element.find(".spec-wrap").css({ bottom: this._element.find(".examples").height() + 20 + "px" });
    
  }
  
}

EditView.EXAMPLES = {
  "assign": "S -> id T.\nT -> V assign E | .\nV -> .\nE -> id V | num .",
  
  "ll0-lr0-0.cfg": "S -> b A i B.\nA -> .\nB -> r C.\nC -> d.",
  "ll0-lr0-1.cfg": "A -> a b B C.\nB -> C x.\nC -> z.",
  "ll0-lr0-2.cfg": "S -> mary Owns Object.\nOwns -> had.\nObject -> a Animal.\nAnimal -> Adverb Adjective Noun.\nAdverb -> .\nAdjective -> little.\nNoun -> lamb.",
  "ll1-lalr1-0.cfg": "S -> id S'.\nS' -> V assign E\n    | .\nV -> .\nE -> id V\n   | num.",
  "ll1-lalr1-1.cfg": "L -> V + L | num.\nV -> Var ( Var + V )\n   | .\nVar -> .",
  "ll1-lalr1-2.cfg": "P -> M *\n   | .\nM -> Q StarM\n   | .\nStarM -> (* M *)\n       | ( Q * ).\nQ -> o\n   | .",
  "ll1-lr0-0.cfg": "A -> B | x C | y A.\nB -> C B.\nC -> r.",
  "ll1-lr0-1.cfg": "A -> y B | x | B C.\nB -> z B | u.\nC -> s.",
  "ll1-lr0-2.cfg": "S -> ( Ses )\n   | (* *).\nSes -> S SL.\nSL -> ; SL | S.",
  "ll1-lr1-0.cfg": "S -> a A\n   | b B.\nA -> C a\n   | D b.\nB -> C b\n   | D a.\nC -> E.\nD -> E.\nE -> .",
  "ll1-lr1-1.cfg": "S -> ( X\n   | E sq)\n   | F ).\n\nX -> E )\n   | F sq).\n\nE -> A.\nF -> A.\nA -> .",
  "ll1-lr1-2.cfg": "E -> id + D\n   | ( E * R )\n   | .\nD -> V * E\n   | L ! E.\nR -> V ! E\n   | L * E.\nV -> Z\n   | num.\nL -> Z\n   | ( E ).\nZ -> .",
  
  "M grammar": "prog -> block.\nblock -> declarations program_body.\ndeclarations -> declaration SEMICOLON declarations |.\ndeclaration -> var_declaration | fun_declaration.\nvar_declaration -> VAR basic_var_declaration.\nbasic_var_declaration -> identifier COLON type.\nfun_declaration -> FUN identifier param_list COLON type CLPAR fun_block CRPAR.\nfun_block -> declarations fun_body.\nparam_list -> LPAR parameters RPAR.\nparameters -> parameters1 |.\nparameters1 -> parameters1 COMMA basic_var_declaration | basic_var_declaration.\nidentifier -> ID.\ntype -> INT | BOOL.\nprogram_body -> BEGIN prog_stmts END | prog_stmts.\nfun_body -> BEGIN prog_stmts RETURN expr SEMICOLON END | prog_stmts RETURN expr SEMICOLON.\nprog_stmts -> prog_stmt SEMICOLON prog_stmts |.\nprog_stmt -> IF expr THEN prog_stmt ELSE prog_stmt | WHILE expr DO prog_stmt | READ ID | ID ASSIGN expr | PRINT expr | CLPAR block CRPAR.\nexpr -> expr OR bint_term | bint_term.\nbint_term -> bint_term AND bint_factor | bint_factor.\nbint_factor -> NOT bint_factor | int_expr compare_op int_expr | int_expr.\ncompare_op -> EQUAL | LT | GT | LE |GE.\nint_expr -> int_expr addop int_term | int_term.\naddop -> ADD | SUB.\nint_term -> int_term mulop int_factor | int_factor.\nmulop -> MUL | DIV.\nint_factor -> LPAR expr RPAR | ID argument_list | NUM | BVAL | SUB int_factor.\nargument_list -> LPAR arguments RPAR |.\narguments -> arguments1 |.\narguments1 -> arguments1 COMMA expr | expr.",
  
  "C grammar (Jutta Degener)": "start -> translation_unit .\nprimary_expression -> IDENTIFIER | CONSTANT | STRING_LITERAL | \"(\" expression \")\" .\npostfix_expression -> primary_expression | postfix_expression \"[\" expression \"]\" | postfix_expression \"(\" \")\" | postfix_expression \"(\" argument_expression_list \")\" | postfix_expression \".\" IDENTIFIER | postfix_expression PTR_OP IDENTIFIER | postfix_expression INC_OP | postfix_expression DEC_OP | \"(\" type_name \")\" \"{\" initializer_list \"}\" | \"(\" type_name \")\" \"{\" initializer_list \",\" \"}\" .\nargument_expression_list -> assignment_expression | argument_expression_list \",\" assignment_expression .\nunary_expression -> postfix_expression | INC_OP unary_expression | DEC_OP unary_expression | unary_operator cast_expression | SIZEOF unary_expression | SIZEOF \"(\" type_name \")\" .\nunary_operator -> \"&\" | \"*\" | \"+\" | \"-\" | \"~\" | \"!\" .\ncast_expression -> unary_expression | \"(\" type_name \")\" cast_expression .\nmultiplicative_expression -> cast_expression | multiplicative_expression \"*\" cast_expression | multiplicative_expression \"/\" cast_expression | multiplicative_expression \"%\" cast_expression .\nadditive_expression -> multiplicative_expression | additive_expression \"+\" multiplicative_expression | additive_expression \"-\" multiplicative_expression .\nshift_expression -> additive_expression | shift_expression LEFT_OP additive_expression | shift_expression RIGHT_OP additive_expression .\nrelational_expression -> shift_expression | relational_expression \"<\" shift_expression | relational_expression \">\" shift_expression | relational_expression LE_OP shift_expression | relational_expression GE_OP shift_expression .\nequality_expression -> relational_expression | equality_expression EQ_OP relational_expression | equality_expression NE_OP relational_expression .\nand_expression -> equality_expression | and_expression \"&\" equality_expression .\nexclusive_or_expression -> and_expression | exclusive_or_expression \"^\" and_expression .\ninclusive_or_expression -> exclusive_or_expression | inclusive_or_expression \"|\" exclusive_or_expression .\nlogical_and_expression -> inclusive_or_expression | logical_and_expression AND_OP inclusive_or_expression .\nlogical_or_expression -> logical_and_expression | logical_or_expression OR_OP logical_and_expression .\nconditional_expression -> logical_or_expression | logical_or_expression \"?\" expression \":\" conditional_expression .\nassignment_expression -> conditional_expression | unary_expression assignment_operator assignment_expression .\nassignment_operator -> \"=\" | MUL_ASSIGN | DIV_ASSIGN | MOD_ASSIGN | ADD_ASSIGN | SUB_ASSIGN | LEFT_ASSIGN | RIGHT_ASSIGN | AND_ASSIGN | XOR_ASSIGN | OR_ASSIGN .\nexpression -> assignment_expression | expression \",\" assignment_expression .\nconstant_expression -> conditional_expression .\ndeclaration -> declaration_specifiers \";\" | declaration_specifiers init_declarator_list \";\" .\ndeclaration_specifiers -> storage_class_specifier | storage_class_specifier declaration_specifiers | type_specifier | type_specifier declaration_specifiers | type_qualifier | type_qualifier declaration_specifiers | function_specifier | function_specifier declaration_specifiers .\ninit_declarator_list -> init_declarator | init_declarator_list \",\" init_declarator .\ninit_declarator -> declarator | declarator \"=\" initializer .\nstorage_class_specifier -> TYPEDEF | EXTERN | STATIC | AUTO | REGISTER .\ntype_specifier -> VOID | CHAR | SHORT | INT | LONG | FLOAT | DOUBLE | SIGNED | UNSIGNED | BOOL | COMPLEX | IMAGINARY | struct_or_union_specifier | enum_specifier | TYPE_NAME .\nstruct_or_union_specifier -> struct_or_union IDENTIFIER \"{\" struct_declaration_list \"}\" | struct_or_union \"{\" struct_declaration_list \"}\" | struct_or_union IDENTIFIER .\nstruct_or_union -> STRUCT | UNION .\nstruct_declaration_list -> struct_declaration | struct_declaration_list struct_declaration .\nstruct_declaration -> specifier_qualifier_list struct_declarator_list \";\" .\nspecifier_qualifier_list -> type_specifier specifier_qualifier_list | type_specifier | type_qualifier specifier_qualifier_list | type_qualifier .\nstruct_declarator_list -> struct_declarator | struct_declarator_list \",\" struct_declarator .\nstruct_declarator -> declarator | \":\" constant_expression | declarator \":\" constant_expression .\nenum_specifier -> ENUM \"{\" enumerator_list \"}\" | ENUM IDENTIFIER \"{\" enumerator_list \"}\" | ENUM \"{\" enumerator_list \",\" \"}\" | ENUM IDENTIFIER \"{\" enumerator_list \",\" \"}\" | ENUM IDENTIFIER .\nenumerator_list -> enumerator | enumerator_list \",\" enumerator .\nenumerator -> IDENTIFIER | IDENTIFIER \"=\" constant_expression .\ntype_qualifier -> CONST | RESTRICT | VOLATILE .\nfunction_specifier -> INLINE .\ndeclarator -> pointer direct_declarator | direct_declarator .\ndirect_declarator -> IDENTIFIER | \"(\" declarator \")\" | direct_declarator \"[\" type_qualifier_list assignment_expression \"]\" | direct_declarator \"[\" type_qualifier_list \"]\" | direct_declarator \"[\" assignment_expression \"]\" | direct_declarator \"[\" STATIC type_qualifier_list assignment_expression \"]\" | direct_declarator \"[\" type_qualifier_list STATIC assignment_expression \"]\" | direct_declarator \"[\" type_qualifier_list \"*\" \"]\" | direct_declarator \"[\" \"*\" \"]\" | direct_declarator \"[\" \"]\" | direct_declarator \"(\" parameter_type_list \")\" | direct_declarator \"(\" identifier_list \")\" | direct_declarator \"(\" \")\" .\npointer -> \"*\" | \"*\" type_qualifier_list | \"*\" pointer | \"*\" type_qualifier_list pointer .\ntype_qualifier_list -> type_qualifier | type_qualifier_list type_qualifier .\nparameter_type_list -> parameter_list | parameter_list \",\" ELLIPSIS .\nparameter_list -> parameter_declaration | parameter_list \",\" parameter_declaration .\nparameter_declaration -> declaration_specifiers declarator | declaration_specifiers abstract_declarator | declaration_specifiers .\nidentifier_list -> IDENTIFIER | identifier_list \",\" IDENTIFIER .\ntype_name -> specifier_qualifier_list | specifier_qualifier_list abstract_declarator .\nabstract_declarator -> pointer | direct_abstract_declarator | pointer direct_abstract_declarator .\ndirect_abstract_declarator -> \"(\" abstract_declarator \")\" | \"[\" \"]\" | \"[\" assignment_expression \"]\" | direct_abstract_declarator \"[\" \"]\" | direct_abstract_declarator \"[\" assignment_expression \"]\" | \"[\" \"*\" \"]\" | direct_abstract_declarator \"[\" \"*\" \"]\" | \"(\" \")\" | \"(\" parameter_type_list \")\" | direct_abstract_declarator \"(\" \")\" | direct_abstract_declarator \"(\" parameter_type_list \")\" .\ninitializer -> assignment_expression | \"{\" initializer_list \"}\" | \"{\" initializer_list \",\" \"}\" .\ninitializer_list -> initializer | designation initializer | initializer_list \",\" initializer | initializer_list \",\" designation initializer .\ndesignation -> designator_list \"=\" .\ndesignator_list -> designator | designator_list designator .\ndesignator -> \"[\" constant_expression \"]\" | \".\" IDENTIFIER .\nstatement -> labeled_statement | compound_statement | expression_statement | selection_statement | iteration_statement | jump_statement .\nlabeled_statement -> IDENTIFIER \":\" statement | CASE constant_expression \":\" statement | DEFAULT \":\" statement .\ncompound_statement -> \"{\" \"}\" | \"{\" block_item_list \"}\" .\nblock_item_list -> block_item | block_item_list block_item .\nblock_item -> declaration | statement .\nexpression_statement -> \";\" | expression \";\" .\nselection_statement -> IF \"(\" expression \")\" statement | IF \"(\" expression \")\" statement ELSE statement | SWITCH \"(\" expression \")\" statement .\niteration_statement -> WHILE \"(\" expression \")\" statement | DO statement WHILE \"(\" expression \")\" \";\" | FOR \"(\" expression_statement expression_statement \")\" statement | FOR \"(\" expression_statement expression_statement expression \")\" statement | FOR \"(\" declaration expression_statement \")\" statement | FOR \"(\" declaration expression_statement expression \")\" statement .\njump_statement -> GOTO IDENTIFIER \";\" | CONTINUE \";\" | BREAK \";\" | RETURN \";\" | RETURN expression \";\" .\ntranslation_unit -> external_declaration | translation_unit external_declaration .\nexternal_declaration -> function_definition | declaration .\nfunction_definition -> declaration_specifiers declarator declaration_list compound_statement | declaration_specifiers declarator compound_statement .\ndeclaration_list -> declaration | declaration_list declaration ."
};
