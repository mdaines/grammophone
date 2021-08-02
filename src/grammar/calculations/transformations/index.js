module.exports["transformations.expand"] = require("./expand");
module.exports["transformations.removeImmediateLeftRecursion"] = require("./removeImmediateLeftRecursion");
module.exports["transformations.leftFactor"] = require("./leftFactor");
module.exports["transformations.epsilonSeparate"] = require("./epsilonSeparate");
module.exports["transformations.removeUnreachable"] = require("./removeUnreachable");

module.exports["transformations"] = function(grammar) {
  return [].concat(grammar.calculate("transformations.expand"))
           .concat(grammar.calculate("transformations.removeImmediateLeftRecursion"))
           .concat(grammar.calculate("transformations.leftFactor"))
           .concat(grammar.calculate("transformations.epsilonSeparate"))
           .concat(grammar.calculate("transformations.removeUnreachable"));
}
