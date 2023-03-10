export default function({ error }) {
  return (
    <div id="error">
      <code>{error ? error.toString() : ""}</code>
    </div>
  );
}
