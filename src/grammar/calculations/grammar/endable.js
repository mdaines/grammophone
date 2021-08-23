var END = require("../../symbols").END;

module.exports = function(grammar) {

  var s;
  var endable = new Set();
  var follow = grammar.calculate("grammar.follow");

  for (s in follow) {
    if (follow[s][END]) {
      endable.add(s);
    }
  }

  return endable;

};
