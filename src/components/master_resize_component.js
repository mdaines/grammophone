import { useEffect } from "preact/hooks";

const MIN_WIDTH = 250;
const MASTER_RESIZE_LOCAL_STORAGE_KEY = "grammophone-width-handle";

export default function () {
  useEffect(() => {
    const initialWidth = localStorage.getItem(MASTER_RESIZE_LOCAL_STORAGE_KEY) || 300;
    document.documentElement.style.setProperty("--editor-width", `${initialWidth}px`);
  }, []);

  function handleMouseDown() {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  }

  function handleMouseMove(e) {
    const w = Math.max(MIN_WIDTH, e.screenX);
    localStorage.setItem(MASTER_RESIZE_LOCAL_STORAGE_KEY, w);
    document.documentElement.style.setProperty("--editor-width", `${w}px`);
  }

  function handleMouseUp() {
    document.removeEventListener("mousemove", handleMouseMove);
  }

  return <div onMouseDown={handleMouseDown} id="master-resize-handle" />;
}
