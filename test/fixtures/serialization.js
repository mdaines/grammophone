import Relation from "../../src/relation.js";

export function replacer(k, v) {
  if (v instanceof Set) {
    return Array.from(v);
  } else if (v instanceof Map) {
    return Array.from(v);
  } else if (v instanceof Relation) {
    return Array.from(v.entries());
  } else if (typeof v === "undefined") {
    return null;
  } else {
    return v;
  }
}
