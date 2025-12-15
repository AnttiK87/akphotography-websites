import "./LoadingScreen.css";

import { useLanguage } from "../../hooks/useLanguage";

function ErrorScreen() {
  const { language } = useLanguage();

  const loadingText =
    language === "fin"
      ? "Tapahtui virhe ladattaessa sisältöä..."
      : "Error occurred durin load...";

  return (
    <div className="loading-screen">
      <p className="loading-text">{loadingText}</p>
    </div>
  );
}

export default ErrorScreen;
