var automaton = require("./helpers").automaton;
var lr0 = require("./build/lr0");

module.exports = function(grammar) {

  return automaton(grammar, lr0);

}
