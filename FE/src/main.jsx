import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles/global.css";

try {
  const theme = localStorage.getItem("eels_theme");
  if (theme === "dark" || theme === "light") {
    document.documentElement.setAttribute("data-theme", theme);
  }
} catch {
  // Storage can be blocked; the app still renders.
}

createRoot(document.getElementById("root")).render(<App />);
