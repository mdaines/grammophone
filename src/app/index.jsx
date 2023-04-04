import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import { getURLSearchParamSpec } from "./spec_links.js";

const root = createRoot(document.getElementById("app"));
root.render(<StrictMode><App initialSpec={getURLSearchParamSpec()} /></StrictMode>);
