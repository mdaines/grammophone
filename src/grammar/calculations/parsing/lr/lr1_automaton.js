import { automaton } from "./helpers.js";
import lr1 from "./build/lr1.js";

export default function(grammar) {

  return automaton(grammar, lr1);

}
