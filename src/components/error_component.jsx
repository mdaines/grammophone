export default function ErrorComponent({ error }) {
  return (
    <div id="error">
      <code>{error ? error.toString() : ""}</code>
    </div>
  );
}
