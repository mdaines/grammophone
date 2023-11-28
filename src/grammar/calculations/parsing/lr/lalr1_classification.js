import { classifyLR } from "./helpers.js";

export default function({ lalr1Table: table }) {
  return classifyLR(table);
}
