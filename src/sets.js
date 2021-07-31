var Sets = {

  count: function(set) {

    var n;
    var result = 0;

    for (n in set) {
      result++;
    }

    return result;

  },

  any: function(set) {

    var n;

    for (n in set) {
      return true;
    }

    return false;

  },

  intersection: function(a, b) {

    var result = {};
    var k;

    for (k in a) {
      if (b[k]) {
        result[k] = true;
      }
    }

    return result;

  }

};

module.exports = Sets;
