var Relation = {
  
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
    
    var i, j, k;
    var result = {};
    var keys = {};
  
    // Copy the relation and build the set of keys
  
    for (i in relation) {
      keys[i] = true;
      
      for (j in relation[i]) {
        keys[j] = true;
      
        result[i] = result[i] || {};
        result[i][j] = relation[i][j];
      }
    }
    
    for (i in keys) {
      result[i] = result[i] || {};
    }
  
    // Perform transitive closure
    
    for (k in keys) {
      for (i in keys) {
        for (j in keys) {
          if (result[i][j] || (result[i][k] && result[k][j]))
            result[i][j] = true;
        }
      }
    }
  
    return result;
  
  },
  
  // Propagate the immediate relation using the (closure of the) propagation relation.
  
  propagate: function(immediate, propagation) {
    
    var k, l, s, t, u;
  
    var result = {};
    var closed = this.closure(propagation);
  
    for (k in immediate) {
      for (l in immediate[k]) {
        result[k] = result[k] || {};
        result[k][l] = immediate[k][l];
      }
    }
  
    for (s in closed) {
      for (t in closed[s]) {
        for (u in immediate[t]) {
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
    
      var w, l;
    
      for (l in relation[k]) {
        
        if (v.indexOf(l) != -1) {
          if (l == k)
            return v.concat(k);
          else
            return v.concat(k).concat(l);
        }
        
        if (w = dfs(l, v.concat(k)))
          return w;
      
      }
    
      return undefined;
    
    }
  
    var v, k;
  
    for (k in relation) {
      if (v = dfs(k, []))
        return v;
    }
  
    return undefined;
  
  }
  
};

module.exports = Relation;
