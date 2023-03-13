export default {
  // Louden, p.170
  expressions: [
    [ 'exp', 'exp', 'addop', 'term' ],
    [ 'exp', 'term' ],
    [ 'addop', '+' ],
    [ 'addop', '-' ],
    [ 'term', 'term', 'mulop', 'factor' ],
    [ 'term', 'factor' ],
    [ 'mulop', '*' ],
    [ 'factor', '(', 'exp', ')' ],
    [ 'factor', 'number' ]
  ],

  // Louden, p.171
  ifelse: [
    [ 'statement', 'if-stmt' ],
    [ 'statement', 'other' ],
    [ 'if-stmt', 'if', '(', 'exp', ')', 'statement', 'else-part' ],
    [ 'else-part', 'else', 'statement' ],
    [ 'else-part' ],
    [ 'exp', '0' ],
    [ 'exp', '1' ]
  ],

  // Louden, p.173
  statements: [
    [ 'stmt-sequence', 'stmt', "stmt-seq'" ],
    [ "stmt-seq'", ';', 'stmt-sequence' ],
    [ "stmt-seq'" ],
    [ 'stmt', 's' ]
  ]
}
