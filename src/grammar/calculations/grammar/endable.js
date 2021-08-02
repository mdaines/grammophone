var END = require("../../symbols").END;

module.exports = function(grammar) {

  var s;
  var endable = {};
  var follow = grammar.calculate("grammar.follow");

  for (s in follow) {
    if (follow[s][END]) {
      endable[s] = true;
    }
  }

  return endable;

};
