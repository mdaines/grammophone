export default function({ productions }) {
  let result = new Set();

  for (let production of productions) {
    for (let symbol of production) {
      result.add(symbol);
    }
  }

  return result;
}
