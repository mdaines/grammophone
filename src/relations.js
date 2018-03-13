'use strict';

const Sets = require('./sets');

const Relations = {
  create: function() {
    return {};
  },

  // Add to a relation.

  add: function(relation, s, t) {
    relation[s] = relation[s] || {};
    relation[s][t] = true;
  },

  // Given a relation, return its transitive closure as a new object.
  // (floyd-warshall)

  closure: function(relation) {
    let result = {};
    let keys = {};

    // Copy the relation and build the set of keys

    for (let i in relation) {
      keys[i] = true;

      for (let j in relation[i]) {
        keys[j] = true;

        result[i] = result[i] || {};
        result[i][j] = relation[i][j];
      }
    }

    for (let i in keys) {
      result[i] = result[i] || {};
    }

    // Perform transitive closure

    for (let k in keys) {
      for (let i in keys) {
        for (let j in keys) {
          if (result[i][j] || (result[i][k] && result[k][j])) {
            result[i][j] = true;
          }
        }
      }
    }

    return result;
  },

  // Propagate the immediate relation using the (closure of the) propagation relation.

  propagate: function(immediate, propagation) {
    let result = {};
    let closed = this.closure(propagation);

    for (let k in immediate) {
      for (let l in immediate[k]) {
        result[k] = result[k] || {};
        result[k][l] = immediate[k][l];
      }
    }

    for (let s in closed) {
      for (let t in closed[s]) {
        for (let u in immediate[t]) {
          result[s] = result[s] || {};
          result[s][u] = immediate[t][u];
        }
      }
    }

    return result;
  },

  // If the graph of the relation has a cycle, return the first
  // cycle we find. Otherwise, return undefined.

  cycle: function(relation) {
    function dfs(k, v) {
      for (let l in relation[k]) {
        if (v.indexOf(l) !== -1) {
          if (l === k) {
            return v.concat(k);
          } else {
            return v.concat(k).concat(l);
          }
        }

        let w = dfs(l, v.concat(k));

        if (w) {
          return w;
        }
      }

      return undefined;
    }

    for (let k in relation) {
      let v = dfs(k, []);

      if (v) {
        return v;
      }
    }

    return undefined;
  },

  equal: function(a, b) {
    if (Sets.count(a) !== Sets.count(b)) {
      return false;
    }

    for (let k in a) {
      if (a.hasOwnProperty(k) && !Sets.equal(a[k], b[k])) {
        return false;
      }
    }

    return true;
  }
};

module.exports = Relations;
