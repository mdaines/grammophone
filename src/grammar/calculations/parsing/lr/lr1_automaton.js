var automaton = require("./helpers").automaton;
var lr1 = require("./helpers").lr1;

module.exports = function(grammar) {

  return automaton(grammar, lr1);

}
