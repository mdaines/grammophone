const m = require("mithril");

module.exports = function(input) {
  let mode = input.mode;

  return [
    m("input#mode-edit", { type: "radio", name: "mode", value: "edit", checked: mode === "edit" }),
    m("label.left", { for: "mode-edit" }, "Edit"),
    m("input#mode-transform", { type: "radio", name: "mode", value: "transform", checked: mode === "transform" }),
    m("label.right", { for: "mode-transform" }, "Transform"),
    m("button#mode-analyze", { disabled: mode !== "edit" }, "Analyze")
  ];
}
