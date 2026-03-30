import PropTypes from "prop-types";
import { useRef } from "react";

let statusTimeout;

export default function ModeComponent({ mode, edit, transform, analyze, copySpecLink }) {
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
      return new Promise((resolve) => {
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

ModeComponent.propTypes = {
  mode: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired,
  transform: PropTypes.func.isRequired,
  analyze: PropTypes.func.isRequired,
  copySpecLink: PropTypes.func.isRequired
};
