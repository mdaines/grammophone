import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import { getURLSearchParamSpec } from "./spec_links.js";

function handleResize(width) {
  appElement.style.setProperty("--editor-width", width + "px");
}

const appElement = document.getElementById("app");

const initialSpec = getURLSearchParamSpec(window.location.search);

const root = createRoot(appElement);
root.render(<StrictMode><App initialSpec={initialSpec} onResize={handleResize} /></StrictMode>);
