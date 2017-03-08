'use strict';

const END = require('../../symbols').END;

module.exports["grammar.endable"] = function(grammar) {

  let endable = {};
  const follow = grammar.calculate("grammar.follow");

  for (let s in follow) {
    if (follow[s][END]) {
      endable[s] = true;
    }
  }

  return endable;

};
