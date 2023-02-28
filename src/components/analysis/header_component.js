module.exports = function({ path }) {
  let segments = [];

  path.forEach(function(segment) {
    if (segment.path) {
      segments.push(<a href={"#" + segment.path}>{segment.title}</a>);
      segments.push(" / ");
    } else {
      segments.push(<b>{segment.title}</b>);
    }
  });

  if (segments.length > 0) {
    return <nav>{segments}</nav>;
  }
}
