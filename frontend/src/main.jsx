import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LightBoxProvider } from "./contexts/LightBoxContext.jsx";
import { Provider } from "react-redux";
import store from "./reducers/store";
import App from "./App.jsx";

import DisableScrollRestoration from "./DisableScrollRestoration.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <Provider store={store}>
      <Router basename="/">
        <LightBoxProvider>
          <DisableScrollRestoration />
          <App />
        </LightBoxProvider>
      </Router>
    </Provider>
  </LanguageProvider>
);
