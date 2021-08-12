const m = require("mithril");

module.exports = function(input) {
  let spec = input.spec;

  return m("div.spec-wrap",
    m("textarea.spec", { value: spec })
  );
};
