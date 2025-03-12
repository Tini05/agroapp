import ReactDOM from "react-dom/client";
import App from "./App";
import "./utils/translate"; // Import i18next config

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

