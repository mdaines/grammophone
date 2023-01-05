const { linter } = require("@codemirror/lint");
const { syntaxTree } = require("@codemirror/language");

module.exports = linter((view) => {
  let diagnostics = [];

  syntaxTree(view.state).cursor().iterate((node) => {
    if (node.type.isError) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: "error",
        message: "Syntax error"
      });
    }
  });

  return diagnostics;
});
