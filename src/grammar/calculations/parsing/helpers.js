import { END } from "../../symbols.js";

export function getFirst({ first, nullable, terminals, nonterminals }, symbols) {

  var i, k;
  var s;
  var result;

  result = new Set();

  for (i = 0; i < symbols.length; i++) {

    s = symbols[i];

    if (s === END) {

      result.add(s);
      break;

    } else if (terminals.has(s)) {

      result.add(s);
      break;

    } else if (nonterminals.has(s)) {

      for (k of first.get(s)) {
        result.add(k);
      }

      if (!nullable.has(s)) {
        break;
      }

    } else {

      throw new Error("Unexpected symbol " + s);

    }

  }

  return result;

}

export function isNullable({ nullable, terminals, nonterminals }, symbols) {

  var i, s;

  for (i = 0; i < symbols.length; i++) {

    s = symbols[i];

    if (nonterminals.has(s)) {

      if (!nullable.has(s)) {
        return false;
      }

    } else if (terminals.has(s)) {

      return false;

    } else {

      throw new Error("Unexpected symbol " + s);

    }

  }

  return true;

}
