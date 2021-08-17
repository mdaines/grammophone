const m = require("mithril/hyperscript");

module.exports = function(input) {
  let spec = input.spec;

  return m("div.spec-wrap",
    m("textarea.spec", { value: spec })
  );
};
