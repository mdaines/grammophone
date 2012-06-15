var Set = {
  
  count: function(set) {
    
    var n;
    var result = 0;
    
    for (n in set)
      result++;
      
    return result;
    
  },
  
  any: function(set) {
    
    var n;
    
    for (n in set)
      return true;
    
    return false;
    
  }
  
};
