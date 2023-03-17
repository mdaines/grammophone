import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";

const root = createRoot(document.getElementById("app"));
root.render(<StrictMode><App /></StrictMode>);
