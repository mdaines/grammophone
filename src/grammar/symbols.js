export const END = "Grammar.END";

const UNQUOTED_SYMBOL_PATTERN = /^[A-Za-z_$][A-Za-z_$0-9]*$/;

export function quoteSymbol(s) {
  if (s.match(UNQUOTED_SYMBOL_PATTERN)) {
    return s;
  } else {
    return JSON.stringify(s);
  }
}
