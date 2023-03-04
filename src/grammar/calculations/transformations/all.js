export default function(grammar) {
  return [].concat(grammar.calculate("transformations.expand"))
           .concat(grammar.calculate("transformations.removeImmediateLeftRecursion"))
           .concat(grammar.calculate("transformations.leftFactor"))
           .concat(grammar.calculate("transformations.epsilonSeparate"))
           .concat(grammar.calculate("transformations.removeUnreachable"));
}
