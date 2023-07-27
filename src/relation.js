export default class Relation {
  constructor(iterable) {
    this._map = new Map();

    if (iterable != null) {
      for (let [s, t] of iterable) {
        this.add(s, t);
      }
    }
  }

  has(s, t) {
    if (this._map.has(s)) {
      return this._map.get(s).has(t);
    } else {
      return false;
    }
  }

  get(s) {
    if (this._map.has(s)) {
      return this._map.get(s);
    } else {
      return new Set();
    }
  }

  keys() {
    return this._map.keys();
  }

  *[Symbol.iterator]() {
    for (let k of this._map.keys()) {
      for (let l of this._map.get(k)) {
        yield [k, l];
      }
    }
  }

  entries() {
    return this[Symbol.iterator]();
  }

  add(s, t) {
    if (!this._map.has(s)) {
      this._map.set(s, new Set());
    }

    this._map.get(s).add(t);
  }

  propagate(propagation) {
    let result = new Relation();
    let closed = propagation.closure();

    for (let k of this.keys()) {
      for (let l of this.get(k)) {
        result.add(k, l);
      }
    }

    for (let s of closed.keys()) {
      for (let t of closed.get(s)) {
        for (let u of this.get(t)) {
          result.add(s, u);
        }
      }
    }

    return result;
  }

  closure() {
    var result = new Relation();
    var keys = new Set();

    // Copy the relation and build the set of keys

    for (let i of this.keys()) {
      keys.add(i);

      for (let j of this.get(i)) {
        keys.add(j);

        result.add(i, j);
      }
    }

    // Perform transitive closure

    for (let k of keys) {
      for (let i of keys) {
        for (let j of keys) {
          if (result.has(i, j) || (result.has(i, k) && result.has(k, j))) {
            result.add(i, j);
          }
        }
      }
    }

    return result;
  }

  dfs(k, v) {
    for (let l of this.get(k)) {
      if (v.indexOf(l) != -1) {
        if (l == k) {
          return v.concat(k);
        } else {
          return v.concat(k).concat(l);
        }
      }

      let w = this.dfs(l, v.concat(k));
      if (w) {
        return w;
      }
    }

    return undefined;
  }

  cycle() {
    for (let k of this.keys()) {
      let v = this.dfs(k, []);
      if (v) {
        return v;
      }
    }

    return undefined;
  }

  graph() {
    return {
      data: {},
      nodes: [],
      edges: Array.from(this.entries(), ([source, target]) => ({ source, target, data: {} }))
    };
  }
}
