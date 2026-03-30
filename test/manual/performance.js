import Grammar from "../../src/grammar/index.js";

function measure(operation, timeLimit) {
  let callCount = 0;

  const startTime = performance.now();

  while (performance.now() - startTime < timeLimit) {
    operation();
    callCount++;
  }

  const stopTime = performance.now();
  const duration = (stopTime - startTime) / 1000;
  const speed = callCount / duration;

  return `${callCount} in ${duration.toFixed(2)} s, ${speed.toFixed(2)} calls/s`;
}

function randomProductions({
  productionCount,
  maximumProductionLength,
  symbolCount
}) {
  const productions = [];

  for (let i = 0; i < productionCount; i++) {
    const productionLength =
      1 + Math.floor(Math.random() * maximumProductionLength);
    const production = [];

    for (let j = 0; j < productionLength; j++) {
      production.push(`s${Math.floor(Math.random() * symbolCount)}`);
    }

    productions.push(production);
  }

  return productions;
}

const tests = [
  { productionCount: 10, maximumProductionLength: 10, symbolCount: 20 },
  { productionCount: 20, maximumProductionLength: 10, symbolCount: 20 },
  { productionCount: 50, maximumProductionLength: 10, symbolCount: 20 },
  { productionCount: 100, maximumProductionLength: 10, symbolCount: 20 },
  { productionCount: 200, maximumProductionLength: 10, symbolCount: 20 },
  { productionCount: 500, maximumProductionLength: 10, symbolCount: 20 }
];

const timeLimit = 5000;

for (const params of tests) {
  const result = measure(() => {
    const productions = randomProductions(params);
    new Grammar(productions).calculations.classification;
  }, timeLimit);
  console.log(`productionCount=${params.productionCount}: ${result}`);
}
