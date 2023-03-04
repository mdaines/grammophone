import { END } from "../../symbols.js";

export default function(grammar) {

  var s;
  var endable = new Set();
  var follow = grammar.calculate("grammar.follow");

  for (s of follow.keys()) {
    if (follow.has(s, END)) {
      endable.add(s);
    }
  }

  return endable;

}
