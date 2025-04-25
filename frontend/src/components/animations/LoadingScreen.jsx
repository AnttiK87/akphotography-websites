import "./LoadingScreen.css";

import { useLanguage } from "../../hooks/useLanguage";

function LoadingScreen() {
  const { language } = useLanguage();

  const loadingText =
    language === "fin" ? "Ladataan sisältöä..." : "Loading content...";

  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p className="loading-text">{loadingText}</p>
    </div>
  );
}

export default LoadingScreen;
