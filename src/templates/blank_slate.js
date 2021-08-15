const m = require("mithril");

module.exports = function() {
  let result = [];

  result.push(
    "<section>",
    "<p><b>Grammophone</b> is a tool for analyzing and transforming context-free grammars. To start, type a grammar in the box to the left and click Analyze or Transform.</p>",
    "<p>Grammars are written like this:</p>",
    "<pre>S -> a S b .\nS -> .</pre>",
    "<p>This grammar generates the language a<sup>n</sup>&nbsp;b<sup>n</sup>, where n&nbsp;≥&nbsp;0.</p>",
    "</section>"
  );

  return m.trust(result.join(""));
}
