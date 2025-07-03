import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { LightBoxProvider } from "./contexts/LightBoxContext";
import { ImageIndexProvider } from "./contexts/ImageIndexContext";
import { Provider } from "react-redux";
import store from "./reducers/store";
import App from "./App.jsx";

import DisableScrollRestoration from "./DisableScrollRestoration";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <Provider store={store}>
      <Router basename="/">
        <LightBoxProvider>
          <ImageIndexProvider>
            <DisableScrollRestoration />
            <App />
          </ImageIndexProvider>
        </LightBoxProvider>
      </Router>
    </Provider>
  </LanguageProvider>
);
