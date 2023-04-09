import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import { getURLSearchParamSpec } from "./spec_links.js";

const initialSpec = getURLSearchParamSpec(window.location.search);
const root = createRoot(document.getElementById("app"));
root.render(<StrictMode><App initialSpec={initialSpec} /></StrictMode>);
