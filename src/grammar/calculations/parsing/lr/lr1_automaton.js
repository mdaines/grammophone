import { automaton } from "./helpers.js";
import * as build from "./build/lr1.js";

export default function(calculations) {
  return automaton(calculations, build);
}
