import { END } from "../../symbols.js";

export default function({ follow }) {

  var s;
  var endable = new Set();

  for (s of follow.keys()) {
    if (follow.has(s, END)) {
      endable.add(s);
    }
  }

  return endable;

}
