function any(set) {
  return set.size > 0;
}

function intersection(a, b) {
  let result = new Set();

  for (let k of a.values()) {
    if (b.has(k)) {
      result.add(k);
    }
  }

  return result;
}

module.exports.any = any;
module.exports.intersection = intersection;
