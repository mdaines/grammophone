import { useRef } from "react";

let statusTimeout;

export default function({ mode, edit, transform, analyze, copySpecLink }) {
  function onChange(e) {
    if (e.target.value === "edit") {
      edit();
    } else if (e.target.value === "transform") {
      transform();
    }
  }

  function handleCopy() {
    copySpecLink().then(() => {
      copyButtonRef.current?.classList.add("show-status");

      clearTimeout(statusTimeout);
      return new Promise((resolve, reject) => {
        statusTimeout = setTimeout(resolve, 1000);
      });
    })
    .catch((error) => {
      console.error(error);
    })
    .then(() => {
      copyButtonRef.current?.classList.remove("show-status");
    });
  }

  const copyButtonRef = useRef(null);

  return (
    <div id="mode">
      <div id="mode-switch">
        <input id="mode-edit" type="radio" name="mode" value="edit" checked={mode === "edit"} onChange={onChange} />
        <label className="left" htmlFor="mode-edit">Edit</label>
        <input id="mode-transform" type="radio" name="mode" value="transform" checked={mode === "transform"} onChange={onChange} />
        <label className="right" htmlFor="mode-transform">Transform</label>
      </div>

      <button id="mode-analyze" disabled={mode !== "edit"} onClick={analyze}>Analyze</button>
      <button id="mode-copy" onClick={handleCopy} ref={copyButtonRef}>
        <span className="label">{"Copy Link"}</span>
        <span className="status">{"Copied!"}</span>
      </button>
    </div>
  );
}
