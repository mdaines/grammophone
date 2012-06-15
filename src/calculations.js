// The results of grammar calculations are available by calling
// the #calculate method on a particular grammar with the name of
// the desired calculation, for example:
//
//   first = grammar.calculate("grammar.first");
//
// The results of calculations are stored in the grammar's
// "calculations" object by name of calculation. Calculations may
// also call other calculations.

var Calculations = {};
