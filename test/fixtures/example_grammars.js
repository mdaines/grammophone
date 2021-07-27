// From the original smlweb.cpsc.ucalgary.ca code.

module.exports = {
  "ll0-lr0-0.cfg": `S -> b A i B.
A -> .
B -> r C.
C -> d.`,

  "ll0-lr0-1.cfg": `A -> a b B C.
B -> C x.
C -> z.`,

  "ll0-lr0-2.cfg": `S -> mary Owns Object.
Owns -> had.
Object -> a Animal.
Animal -> Adverb Adjective Noun.
Adverb -> .
Adjective -> little.
Noun -> lamb.`,

  "ll1-lalr1-0.cfg": `S -> id S'.
S' -> V assign E
    | .
V -> .
E -> id V
   | num.`,

  "ll1-lalr1-1.cfg": `L -> V + L | num.
V -> Var ( Var + V )
   | .
Var -> .`,

  "ll1-lalr1-2.cfg": `P -> M *
   | .
M -> Q StarM
   | .
StarM -> (* M *)
       | ( Q * ).
Q -> o
   | .`,

  "ll1-lr0-0.cfg": `A -> B | x C | y A.
B -> C B.
C -> r.`,

  "ll1-lr0-1.cfg": `A -> y B | x | B C.
B -> z B | u.
C -> s.`,

  "ll1-lr0-2.cfg": `S -> ( Ses )
   | (* *).
Ses -> S SL.
SL -> ; SL | S.`,

  "ll1-lr1-0.cfg": `S -> a A
   | b B.
A -> C a
   | D b.
B -> C b
   | D a.
C -> E.
D -> E.
E -> .`,

  "ll1-lr1-1.cfg": `S -> ( X
   | E sq)
   | F ).

X -> E )
   | F sq).

E -> A.
F -> A.
A -> .`,

  "ll1-lr1-2.cfg": `E -> id + D
   | ( E * R )
   | .
D -> V * E
   | L ! E.
R -> V ! E
   | L * E.
V -> Z
   | num.
L -> Z
   | ( E ).
Z -> .`,

  "ll1-slr1-0.cfg": `A -> B c
   | d n A B fo.

B -> r
   | .`,

  "ll1-slr1-1.cfg": `S -> for ( ExprOpt ; ExprOpt ; ExprOpt ) S
   | expr ;.
ExprOpt -> expr
         | .`,

  "ll1-slr1-2.cfg": `Decl -> DeclSpecifiers Declarator.
DeclSpecifiers -> StorageClassSpecifier DeclSpecifiersOpt
                | TypeSpecifier DeclSpecifiersOpt
                | TypeQualifier DeclSpecifiersOpt.
DeclSpecifiersOpt -> DeclSpecifiers | .
StorageClassSpecifier -> typedef | static.
TypeSpecifier -> void | short | int.
TypeQualifier -> const | volatile.
Declarator -> PointerOpt DirectDeclarator.
DirectDeclarator -> id.
PointerOpt -> * TypeQualifierList PointerOpt
            | .
TypeQualifierList -> TypeQualifier TypeQualifierList
                   | .`,

  "ll2-lalr1-0.cfg": `S -> id
   | V assign E.
V -> id.
E -> V
   | num.`,

  "ll2-lalr1-1.cfg": `S' -> S.
S -> L assign R | R.
L -> * R | id.
R -> L.`,

  "ll2-lalr1-2.cfg": `S -> A x B x.
S -> B y A y.
A -> w.
B -> w.`,

  "ll2-lr0-0.cfg": `S -> Block
   | ( ).
Block -> ( stmt ).`,

  "ll2-lr0-1.cfg": `S -> Assign
   | Inc.
Assign -> Lv equals Rv.
Inc -> Lv ++
     | Lv //.
Rv -> Lv | num.
Lv -> id.`,

  "ll2-lr0-2.cfg": `Emoticon -> Happy
          | Sad.
Happy -> : ).
Sad -> : (.`,

  "ll2-lr1-0.cfg": `S -> a a A
   | a b B.
A -> C a
   | D b.
B -> C b
   | D a.
C -> E.
D -> E.
E -> .`,

  "ll2-lr1-1.cfg": `Value -> number V
       | number.
V -> f Real | i Int.
Real -> IOpt dot
      | BOpt +.
Int -> IOpt +
     | BOpt dot.
BOpt -> Opt.
IOpt -> Opt.
Opt -> .`,

  "ll2-lr1-2.cfg": `S -> ' Q | P.
Q -> T W
   | E ;.
P -> T ;
   | E W.
T -> U.
E -> U.
U -> '.
W -> * W | 8 W | .`,

  "ll2-lr2-0.cfg": `S -> ( X
   | E sq)
   | F (.

X -> E )
   | F sq).

E -> A.
F -> A.
A -> .`,

  "ll2-lr2-1.cfg": `A -> E B SL E
   | b e.

B -> b
   | o r.

E -> e | .

SL -> s SL | s.`,

  "ll2-lr2-2.cfg": `S -> X a.
X -> a | .`,

  "ll2-lr2-3.cfg": `A -> B a.
B -> b C | c.
C -> a B | .`,

  "ll2-lr2-4.cfg": `A -> B C D E.
E -> a.
D -> b | .
C -> c | .
B -> a B | .`,

  "ll2-slr1-0.cfg": `A -> a B
   | a A C
   | .
B -> d B | e.
C -> c A.`,

  "ll2-slr1-1.cfg": `TERM -> id
      | id INDEX
      | let LEXP.
LEXP -> INDEX LEXP
      | id.
INDEX -> lpar TERM rpar.`,

  "ll2-slr1-2.cfg": `Line -> Op | Label.
Op -> Inst Operands.
Label -> id :.
Operands -> Src Src Dest.
Dest -> id | reg | ( Src ).
Src -> Dest | num.
Inst -> pneumonic | Macro.
Macro -> id.`,

  "oth-lalr1-0.cfg": `S -> S ; T
   | T.
T -> id
   | V assign E.
V -> id.
E -> V
   | num.`,

  "oth-lalr1-1.cfg": `L -> V ( args )
   | L equals Var ( ).
V -> Var + V
   | id.
Var -> id.`,

  "oth-lalr1-2.cfg": `E -> O : OL
   | O.
O -> id
   | OL l.
OL -> id
    | ( O : OL ).`,

  "oth-lalr1-3.cfg": `S -> a g d
   | a A c
   | b A d
   | b g c.
A -> B.
B -> g.`,

  "oth-lr0-0.cfg": `A -> C
   | B.
C -> a C a
   | b.
B -> a B
   | c.`,

  "oth-lr0-1.cfg": `S -> A | B.
A -> x A | a.
B -> x B | b.`,

  "oth-lr0-2.cfg": `S -> Parens | StarParens.
Parens -> ( Parens )
        | ( ).
StarParens -> ( StarParens *)
            | ( *).`,

  "oth-lr0-3.cfg": `S -> T | A.
A -> B.
B -> C.
D -> d | d D | .`,

  "oth-lr1-0.cfg": `E -> d D | D | F.
F -> e C | C.
D -> d e B b | e A c.
C -> e d B c | d A b.
B -> a.
A -> a.`,

  "oth-lr1-1.cfg": `S -> S R | .
R -> s StructVar | u NVar.
StructVar -> Var ;
           | Subvar :.
NVar -> Var :
          | Subvar ;.
Var -> V.
Subvar -> V.
V -> id.`,

  "oth-lr1-2.cfg": `S -> S ; C
   | ( C )
   | * D *.
C -> A x
   | B y.
D -> A y
   | B x.
A -> E | id.
B -> E | num.
E -> ! | ( S ).`,

  "oth-lr2-0.cfg": `S -> ( X
   | ( ) S
   | E sq)
   | F (.

X -> E )
   | F sq).

E -> A.
F -> A.
A -> .`,

  "oth-lr2-1.cfg": `S -> A B C D.
A -> a S | .
B -> b | C.
C -> c | D.
D -> d | a B.`,

  "oth-lr2-2.cfg": `B -> A x y
   | C.
A ->
   | x z.
C -> C w
   | v.`,

  "oth-oth-0.cfg": `S -> A d.
A -> a B
   | b B c.
B -> d A
   | .`,

  "oth-oth-1.cfg": `A -> a C
   | B a.
B -> a B | .
C -> a C | b.`,

  "oth-oth-2.cfg": `EXPR -> EXPR mult EXPR
      | TERM.

TERM -> TERM add TERM
      | FACTOR.

FACTOR -> num
        | lpar EXPR rpar
	| star EXPR.`,

  "oth-oth-3.cfg": `A -> a C
   | B a.
B -> a B
   | .
C -> a C
   | .`,

  "oth-oth-4.cfg": `A -> A B | B C.
B -> x A | A y | C n.
C -> z | r.`,

  "oth-oth-5.cfg": `A -> b F.

F -> A x
   | B.

B -> x G.

G -> x B
   | .`,

  "oth-slr1-0.cfg": `A -> A b | c.`,

  "oth-slr1-1.cfg": `EXP -> EXP add TERM
     | TERM.
TERM -> id
      | id INDEX
      | let STMTS in EXP end.
STMTS -> STMTS STMT
       | .
STMT -> LEXP assign EXP semi.
LEXP -> LEXP INDEX
      | id.
INDEX -> lpar EXP rpar.`,

  "oth-slr1-2.cfg": `S -> E.
E -> B + T | B * T | T.
B -> C.
C -> D.
D -> E.
T -> X.
X -> .`
};
