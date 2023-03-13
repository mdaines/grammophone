export default function({ symbols, nonterminals }) {
  let result = new Set();

  for (let s of symbols) {
    if (!nonterminals.has(s)) {
      result.add(s);
    }
  }

  return result;
}
