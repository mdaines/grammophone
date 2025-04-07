import { useEffect, useRef } from "react";

let dragging = false;
let dragOffset;

export default function ResizeComponent({ onResize }) {
  function handleMouseDown(e) {
    e.preventDefault();

    const resizeRect = resizeRef.current.getBoundingClientRect();

    dragging = true;
    dragOffset = Math.round(e.clientX - resizeRect.left);
  }

  function handleMouseMove(e) {
    if (dragging) {
      const width = Math.max(0, e.clientX - dragOffset);
      onResize(width);
    }
  }

  function handleMouseUp() {
    if (dragging) {
      const resizeRect = resizeRef.current.getBoundingClientRect();
      onResize(resizeRect.left);
    }

    dragging = false;
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  let resizeRef = useRef();

  return (
    <div id="resize" ref={resizeRef} onMouseDown={handleMouseDown}>
      <div id="resize-handle">
      </div>
    </div>
  );
}
