module.exports = function({ error }) {
  return (
    <code>{error ? error.toString() : ""}</code>
  );
}
