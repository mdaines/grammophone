const m = require("mithril/hyperscript");

module.exports = function(input) {
  let path = input.path;
  let segments = [];

  path.forEach(function(segment) {
    if (segment.path) {
      segments.push(m("a", { href: "#" + segment.path }, segment.title));
      segments.push(" / ");
    } else {
      segments.push(m("b", segment.title));
    }
  });

  return segments.length > 0 ? m("nav", segments) : [];
}
