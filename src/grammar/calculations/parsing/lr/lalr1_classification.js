import { classifyLR1 } from "./helpers.js";

export default function(grammar) {

  return classifyLR1(grammar.calculate("parsing.lr.lalr1_table"));

}
