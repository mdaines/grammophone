import { automaton } from "./helpers.js";
import lr0 from "./build/lr0.js";

export default function(grammar) {

  return automaton(grammar, lr0);

}
