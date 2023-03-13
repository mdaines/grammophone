export default function({ productions }) {
  let result = new Set();

  for (let production of productions) {
    result.add(production[0]);
  }

  return result;
}
