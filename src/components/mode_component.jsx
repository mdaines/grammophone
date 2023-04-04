export default function({ mode, edit, transform, analyze, copySpecLink }) {
  function onChange(e) {
    if (e.target.value === "edit") {
      edit();
    } else if (e.target.value === "transform") {
      transform();
    }
  }

  return (
    <div id="mode">
      <div id="mode-switch">
        <input id="mode-edit" type="radio" name="mode" value="edit" checked={mode === "edit"} onChange={onChange} />
        <label className="left" htmlFor="mode-edit">Edit</label>
        <input id="mode-transform" type="radio" name="mode" value="transform" checked={mode === "transform"} onChange={onChange} />
        <label className="right" htmlFor="mode-transform">Transform</label>
      </div>

      <button id="mode-analyze" disabled={mode !== "edit"} onClick={analyze}>Analyze</button>
      <button id="mode-copy" onClick={copySpecLink}>Copy Link</button>
    </div>
  );
}
