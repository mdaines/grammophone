var automaton = require("./helpers").automaton;
var lr0 = require("./helpers").lr0;

module.exports = function(grammar) {

  return automaton(grammar, lr0);

}
