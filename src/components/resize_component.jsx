import { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";

let dragging = false;
let dragOffset;

export default function ResizeComponent({ onResize }) {
  const resizeRef = useRef();

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();

    const resizeRect = resizeRef.current.getBoundingClientRect();

    dragging = true;
    dragOffset = Math.round(e.clientX - resizeRect.left);
  }, []);

  const handleMouseMove = useCallback(() => {
    if (dragging) {
      const width = Math.max(0, window.event.clientX - dragOffset);
      onResize(width);
    }
  }, [onResize]);

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      const resizeRect = resizeRef.current.getBoundingClientRect();
      onResize(resizeRect.left);
    }

    dragging = false;
  }, [onResize]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div id="resize" ref={resizeRef} onMouseDown={handleMouseDown}>
      <div id="resize-handle">
      </div>
    </div>
  );
}

ResizeComponent.propTypes = {
  onResize: PropTypes.func.isRequired
};
