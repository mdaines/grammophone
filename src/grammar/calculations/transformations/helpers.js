export function getNewSymbol(symbols, symbol) {
  if (!symbols.has(symbol)) {
    return symbol;
  }

  let match = symbol.match(/(\d+)$/);
  let base, number;

  if (match) {
    base = symbol.substring(0, match.index);
    number = parseInt(match[1], 10) + 1;
  } else {
    base = symbol;
    number = 2;
  }

  let newSymbol;

  do {
    newSymbol = base + String(number);
    number += 1;
  } while (symbols.has(newSymbol));

  return newSymbol;
}
