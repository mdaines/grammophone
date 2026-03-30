import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";
import SiteHeader from "../components/site_header.jsx";
import { getURLSearchParamSpec } from "./spec_links.js";
import "../i18n/index.js";

const initialSpec = getURLSearchParamSpec(window.location.search);

// Render site header
const headerRoot = createRoot(document.getElementById("site-header"));
headerRoot.render(
  <StrictMode>
    <SiteHeader />
  </StrictMode>
);

// Render main app
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App initialSpec={initialSpec} />
  </StrictMode>
);
