export default function(calculations) {
  return [].concat(calculations.expandTransformation)
           .concat(calculations.removeImmediateLeftRecursionTransformation)
           .concat(calculations.leftFactorTransformation)
           .concat(calculations.epsilonSeparateTransformation)
           .concat(calculations.removeUnreachableTransformation);
}
