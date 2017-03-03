'use strict';

const Sets = {
  count: function(set) {
    let result = 0;
    
    /* jshint unused: false */
    for (let n in set) {
      result++;
    }
      
    return result;
    
  },
  
  any: function(set) {
    /* jshint unused: false */
    for (let n in set) {
      return true;
    }
    
    return false;
  },
  
  intersection: function(a, b) {
    let result = {};
    
    for (let k in a) {
      if (b[k]) {
        result[k] = true;
      }
    }
    
    return result;
  }
};

module.exports = Sets;
