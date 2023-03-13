import { classifyLR1 } from "./helpers.js";

export default function({ lalr1Table: table }) {
  return classifyLR1(table);
}
