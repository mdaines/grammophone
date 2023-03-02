module.exports = function({ error }) {
  return (
    <section id="error">
      <code>{error ? error.toString() : ""}</code>
    </section>
  );
}
