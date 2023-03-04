// From the original smlweb.cpsc.ucalgary.ca code.

export default {
  "ll0-lr0-0.cfg": [
    ["S", "b", "A", "i", "B"],
    ["A"],
    ["B", "r", "C"],
    ["C", "d"]
  ],
  "ll0-lr0-1.cfg": [
    ["A", "a", "b", "B", "C"],
    ["B", "C", "x"],
    ["C", "z"]
  ],
  "ll0-lr0-2.cfg": [
    ["S", "mary", "Owns", "Object"],
    ["Owns", "had"],
    ["Object", "a", "Animal"],
    ["Animal", "Adverb", "Adjective", "Noun"],
    ["Adverb"],
    ["Adjective", "little"],
    ["Noun", "lamb"]
  ],
  "ll1-lalr1-0.cfg": [
    ["S", "id", "S'"],
    ["S'", "V", "assign", "E"],
    ["S'"],
    ["V"],
    ["E", "id", "V"],
    ["E", "num"]
  ],
  "ll1-lalr1-1.cfg": [
    ["L", "V", "+", "L"],
    ["L", "num"],
    ["V", "Var", "(", "Var", "+", "V", ")"],
    ["V"],
    ["Var"]
  ],
  "ll1-lalr1-2.cfg": [
    ["P", "M", "*"],
    ["P"],
    ["M", "Q", "StarM"],
    ["M"],
    ["StarM", "(*", "M", "*)"],
    ["StarM", "(", "Q", "*", ")"],
    ["Q", "o"],
    ["Q"]
  ],
  "ll1-lr0-0.cfg": [
    ["A", "B"],
    ["A", "x", "C"],
    ["A", "y", "A"],
    ["B", "C", "B"],
    ["C", "r"]
  ],
  "ll1-lr0-1.cfg": [
    ["A", "y", "B"],
    ["A", "x"],
    ["A", "B", "C"],
    ["B", "z", "B"],
    ["B", "u"],
    ["C", "s"]
  ],
  "ll1-lr0-2.cfg": [
    ["S", "(", "Ses", ")"],
    ["S", "(*", "*)"],
    ["Ses", "S", "SL"],
    ["SL", ";", "SL"],
    ["SL", "S"]
  ],
  "ll1-lr1-0.cfg": [
    ["S", "a", "A"],
    ["S", "b", "B"],
    ["A", "C", "a"],
    ["A", "D", "b"],
    ["B", "C", "b"],
    ["B", "D", "a"],
    ["C", "E"],
    ["D", "E"],
    ["E"]
  ],
  "ll1-lr1-1.cfg": [
    ["S", "(", "X"],
    ["S", "E", "sq)"],
    ["S", "F", ")"],
    ["X", "E", ")"],
    ["X", "F", "sq)"],
    ["E", "A"],
    ["F", "A"],
    ["A"]
  ],
  "ll1-lr1-2.cfg": [
    ["E", "id", "+", "D"],
    ["E", "(", "E", "*", "R", ")"],
    ["E"],
    ["D", "V", "*", "E"],
    ["D", "L", "!", "E"],
    ["R", "V", "!", "E"],
    ["R", "L", "*", "E"],
    ["V", "Z"],
    ["V", "num"],
    ["L", "Z"],
    ["L", "(", "E", ")"],
    ["Z"]
  ],
  "ll1-slr1-0.cfg": [
    ["A", "B", "c"],
    ["A", "d", "n", "A", "B", "fo"],
    ["B", "r"],
    ["B"]
  ],
  "ll1-slr1-1.cfg": [
    ["S", "for", "(", "ExprOpt", ";", "ExprOpt", ";", "ExprOpt", ")", "S"],
    ["S", "expr", ";"],
    ["ExprOpt", "expr"],
    ["ExprOpt"]
  ],
  "ll1-slr1-2.cfg": [
    ["Decl", "DeclSpecifiers", "Declarator"],
    ["DeclSpecifiers", "StorageClassSpecifier", "DeclSpecifiersOpt"],
    ["DeclSpecifiers", "TypeSpecifier", "DeclSpecifiersOpt"],
    ["DeclSpecifiers", "TypeQualifier", "DeclSpecifiersOpt"],
    ["DeclSpecifiersOpt", "DeclSpecifiers"],
    ["DeclSpecifiersOpt"],
    ["StorageClassSpecifier", "typedef"],
    ["StorageClassSpecifier", "static"],
    ["TypeSpecifier", "void"],
    ["TypeSpecifier", "short"],
    ["TypeSpecifier", "int"],
    ["TypeQualifier", "const"],
    ["TypeQualifier", "volatile"],
    ["Declarator", "PointerOpt", "DirectDeclarator"],
    ["DirectDeclarator", "id"],
    ["PointerOpt", "*", "TypeQualifierList", "PointerOpt"],
    ["PointerOpt"],
    ["TypeQualifierList", "TypeQualifier", "TypeQualifierList"],
    ["TypeQualifierList"]
  ],
  "ll2-lalr1-0.cfg": [
    ["S", "id"],
    ["S", "V", "assign", "E"],
    ["V", "id"],
    ["E", "V"],
    ["E", "num"]
  ],
  "ll2-lalr1-1.cfg": [
    ["S'", "S"],
    ["S", "L", "assign", "R"],
    ["S", "R"],
    ["L", "*", "R"],
    ["L", "id"],
    ["R", "L"]
  ],
  "ll2-lalr1-2.cfg": [
    ["S", "A", "x", "B", "x"],
    ["S", "B", "y", "A", "y"],
    ["A", "w"],
    ["B", "w"]
  ],
  "ll2-lr0-0.cfg": [
    ["S", "Block"],
    ["S", "(", ")"],
    ["Block", "(", "stmt", ")"]
  ],
  "ll2-lr0-1.cfg": [
    ["S", "Assign"],
    ["S", "Inc"],
    ["Assign", "Lv", "equals", "Rv"],
    ["Inc", "Lv", "++"],
    ["Inc", "Lv", "//"],
    ["Rv", "Lv"],
    ["Rv", "num"],
    ["Lv", "id"]
  ],
  "ll2-lr0-2.cfg": [
    ["Emoticon", "Happy"],
    ["Emoticon", "Sad"],
    ["Happy", ":", ")"],
    ["Sad", ":", "("]
  ],
  "ll2-lr1-0.cfg": [
    ["S", "a", "a", "A"],
    ["S", "a", "b", "B"],
    ["A", "C", "a"],
    ["A", "D", "b"],
    ["B", "C", "b"],
    ["B", "D", "a"],
    ["C", "E"],
    ["D", "E"],
    ["E"]
  ],
  "ll2-lr1-1.cfg": [
    ["Value", "number", "V"],
    ["Value", "number"],
    ["V", "f", "Real"],
    ["V", "i", "Int"],
    ["Real", "IOpt", "dot"],
    ["Real", "BOpt", "+"],
    ["Int", "IOpt", "+"],
    ["Int", "BOpt", "dot"],
    ["BOpt", "Opt"],
    ["IOpt", "Opt"],
    ["Opt"]
  ],
  "ll2-lr1-2.cfg": [
    ["S", "'", "Q"],
    ["S", "P"],
    ["Q", "T", "W"],
    ["Q", "E", ";"],
    ["P", "T", ";"],
    ["P", "E", "W"],
    ["T", "U"],
    ["E", "U"],
    ["U", "'"],
    ["W", "*", "W"],
    ["W", "8", "W"],
    ["W"]
  ],
  "ll2-lr2-0.cfg": [
    ["S", "(", "X"],
    ["S", "E", "sq)"],
    ["S", "F", "("],
    ["X", "E", ")"],
    ["X", "F", "sq)"],
    ["E", "A"],
    ["F", "A"],
    ["A"]
  ],
  "ll2-lr2-1.cfg": [
    ["A", "E", "B", "SL", "E"],
    ["A", "b", "e"],
    ["B", "b"],
    ["B", "o", "r"],
    ["E", "e"],
    ["E"],
    ["SL", "s", "SL"],
    ["SL", "s"]
  ],
  "ll2-lr2-2.cfg": [
    ["S", "X", "a"],
    ["X", "a"],
    ["X"]
  ],
  "ll2-lr2-3.cfg": [
    ["A", "B", "a"],
    ["B", "b", "C"],
    ["B", "c"],
    ["C", "a", "B"],
    ["C"]
  ],
  "ll2-lr2-4.cfg": [
    ["A", "B", "C", "D", "E"],
    ["E", "a"],
    ["D", "b"],
    ["D"],
    ["C", "c"],
    ["C"],
    ["B", "a", "B"],
    ["B"]
  ],
  "ll2-slr1-0.cfg": [
    ["A", "a", "B"],
    ["A", "a", "A", "C"],
    ["A"],
    ["B", "d", "B"],
    ["B", "e"],
    ["C", "c", "A"]
  ],
  "ll2-slr1-1.cfg": [
    ["TERM", "id"],
    ["TERM", "id", "INDEX"],
    ["TERM", "let", "LEXP"],
    ["LEXP", "INDEX", "LEXP"],
    ["LEXP", "id"],
    ["INDEX", "lpar", "TERM", "rpar"]
  ],
  "ll2-slr1-2.cfg": [
    ["Line", "Op"],
    ["Line", "Label"],
    ["Op", "Inst", "Operands"],
    ["Label", "id", ":"],
    ["Operands", "Src", "Src", "Dest"],
    ["Dest", "id"],
    ["Dest", "reg"],
    ["Dest", "(", "Src", ")"],
    ["Src", "Dest"],
    ["Src", "num"],
    ["Inst", "pneumonic"],
    ["Inst", "Macro"],
    ["Macro", "id"]
  ],
  "oth-lalr1-0.cfg": [
    ["S", "S", ";", "T"],
    ["S", "T"],
    ["T", "id"],
    ["T", "V", "assign", "E"],
    ["V", "id"],
    ["E", "V"],
    ["E", "num"]
  ],
  "oth-lalr1-1.cfg": [
    ["L", "V", "(", "args", ")"],
    ["L", "L", "equals", "Var", "(", ")"],
    ["V", "Var", "+", "V"],
    ["V", "id"],
    ["Var", "id"]
  ],
  "oth-lalr1-2.cfg": [
    ["E", "O", ":", "OL"],
    ["E", "O"],
    ["O", "id"],
    ["O", "OL", "l"],
    ["OL", "id"],
    ["OL", "(", "O", ":", "OL", ")"]
  ],
  "oth-lalr1-3.cfg": [
    ["S", "a", "g", "d"],
    ["S", "a", "A", "c"],
    ["S", "b", "A", "d"],
    ["S", "b", "g", "c"],
    ["A", "B"],
    ["B", "g"]
  ],
  "oth-lr0-0.cfg": [
    ["A", "C"],
    ["A", "B"],
    ["C", "a", "C", "a"],
    ["C", "b"],
    ["B", "a", "B"],
    ["B", "c"]
  ],
  "oth-lr0-1.cfg": [
    ["S", "A"],
    ["S", "B"],
    ["A", "x", "A"],
    ["A", "a"],
    ["B", "x", "B"],
    ["B", "b"]
  ],
  "oth-lr0-2.cfg": [
    ["S", "Parens"],
    ["S", "StarParens"],
    ["Parens", "(", "Parens", ")"],
    ["Parens", "(", ")"],
    ["StarParens", "(", "StarParens", "*)"],
    ["StarParens", "(", "*)"]
  ],
  "oth-lr0-3.cfg": [
    ["S", "T"],
    ["S", "A"],
    ["A", "B"],
    ["B", "C"],
    ["D", "d"],
    ["D", "d", "D"],
    ["D"]
  ],
  "oth-lr1-0.cfg": [
    ["E", "d", "D"],
    ["E", "D"],
    ["E", "F"],
    ["F", "e", "C"],
    ["F", "C"],
    ["D", "d", "e", "B", "b"],
    ["D", "e", "A", "c"],
    ["C", "e", "d", "B", "c"],
    ["C", "d", "A", "b"],
    ["B", "a"],
    ["A", "a"]
  ],
  "oth-lr1-1.cfg": [
    ["S", "S", "R"],
    ["S"],
    ["R", "s", "StructVar"],
    ["R", "u", "NVar"],
    ["StructVar", "Var", ";"],
    ["StructVar", "Subvar", ":"],
    ["NVar", "Var", ":"],
    ["NVar", "Subvar", ";"],
    ["Var", "V"],
    ["Subvar", "V"],
    ["V", "id"]
  ],
  "oth-lr1-2.cfg": [
    ["S", "S", ";", "C"],
    ["S", "(", "C", ")"],
    ["S", "*", "D", "*"],
    ["C", "A", "x"],
    ["C", "B", "y"],
    ["D", "A", "y"],
    ["D", "B", "x"],
    ["A", "E"],
    ["A", "id"],
    ["B", "E"],
    ["B", "num"],
    ["E", "!"],
    ["E", "(", "S", ")"]
  ],
  "oth-lr2-0.cfg": [
    ["S", "(", "X"],
    ["S", "(", ")", "S"],
    ["S", "E", "sq)"],
    ["S", "F", "("],
    ["X", "E", ")"],
    ["X", "F", "sq)"],
    ["E", "A"],
    ["F", "A"],
    ["A"]
  ],
  "oth-lr2-1.cfg": [
    ["S", "A", "B", "C", "D"],
    ["A", "a", "S"],
    ["A"],
    ["B", "b"],
    ["B", "C"],
    ["C", "c"],
    ["C", "D"],
    ["D", "d"],
    ["D", "a", "B"]
  ],
  "oth-lr2-2.cfg": [
    ["B", "A", "x", "y"],
    ["B", "C"],
    ["A"],
    ["A", "x", "z"],
    ["C", "C", "w"],
    ["C", "v"]
  ],
  "oth-oth-0.cfg": [
    ["S", "A", "d"],
    ["A", "a", "B"],
    ["A", "b", "B", "c"],
    ["B", "d", "A"],
    ["B"]
  ],
  "oth-oth-1.cfg": [
    ["A", "a", "C"],
    ["A", "B", "a"],
    ["B", "a", "B"],
    ["B"],
    ["C", "a", "C"],
    ["C", "b"]
  ],
  "oth-oth-2.cfg": [
    ["EXPR", "EXPR", "mult", "EXPR"],
    ["EXPR", "TERM"],
    ["TERM", "TERM", "add", "TERM"],
    ["TERM", "FACTOR"],
    ["FACTOR", "num"],
    ["FACTOR", "lpar", "EXPR", "rpar"],
    ["FACTOR", "star", "EXPR"]
  ],
  "oth-oth-3.cfg": [
    ["A", "a", "C"],
    ["A", "B", "a"],
    ["B", "a", "B"],
    ["B"],
    ["C", "a", "C"],
    ["C"]
  ],
  "oth-oth-4.cfg": [
    ["A", "A", "B"],
    ["A", "B", "C"],
    ["B", "x", "A"],
    ["B", "A", "y"],
    ["B", "C", "n"],
    ["C", "z"],
    ["C", "r"]
  ],
  "oth-oth-5.cfg": [
    ["A", "b", "F"],
    ["F", "A", "x"],
    ["F", "B"],
    ["B", "x", "G"],
    ["G", "x", "B"],
    ["G"]
  ],
  "oth-slr1-0.cfg": [
    ["A", "A", "b"],
    ["A", "c"]
  ],
  "oth-slr1-1.cfg": [
    ["EXP", "EXP", "add", "TERM"],
    ["EXP", "TERM"],
    ["TERM", "id"],
    ["TERM", "id", "INDEX"],
    ["TERM", "let", "STMTS", "in", "EXP", "end"],
    ["STMTS", "STMTS", "STMT"],
    ["STMTS"],
    ["STMT", "LEXP", "assign", "EXP", "semi"],
    ["LEXP", "LEXP", "INDEX"],
    ["LEXP", "id"],
    ["INDEX", "lpar", "EXP", "rpar"]
  ],
  "oth-slr1-2.cfg": [
    ["S", "E"],
    ["E", "B", "+", "T"],
    ["E", "B", "*", "T"],
    ["E", "T"],
    ["B", "C"],
    ["C", "D"],
    ["D", "E"],
    ["T", "X"],
    ["X"]
  ]
};
