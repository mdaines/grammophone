export default function({ mode, edit, transform, analyze }) {
  function onChange(e) {
    if (e.target.value === "edit") {
      edit();
    } else if (e.target.value === "transform") {
      transform();
    }
  }

  return (
    <section id="mode">
      <input id="mode-edit" type="radio" name="mode" value="edit" checked={mode === "edit"} onChange={onChange} />
      <label class="left" for="mode-edit">Edit</label>
      <input id="mode-transform" type="radio" name="mode" value="transform" checked={mode === "transform"} onChange={onChange} />
      <label class="right" for="mode-transform">Transform</label>
      <button id="mode-analyze" disabled={mode !== "edit"} onClick={analyze}>Analyze</button>
    </section>
  );
}
