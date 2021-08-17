const m = require("mithril/hyperscript");
const Helpers = require("../helpers");

module.exports = function(input) {
  let sentences = input.sentences;
  let info = input.info;
  let limit = input.limit;

  let result = [];

  result.push(m("h1", "Example Sentences"));

  if (sentences.length > 0) {
    result.push(
      m("ul.symbols",
        sentences.slice(0, limit).map(function(sentence) {
          return m("li", Helpers.formatSentence(sentence, info));
        })
      )
    );

    if (sentences.length > limit) {
      result.push(m("p", m("a", { href: "#/sentences" }, "More example sentences")));
    }
  } else {
    result.push(m("p", "No example sentences could be generated."));
  }

  return result;
}
