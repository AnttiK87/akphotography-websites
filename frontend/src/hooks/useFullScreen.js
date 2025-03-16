import { useState } from "react";

const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Mene koko näyttöön
  const enterFullscreen = () => {
    document.body.requestFullscreen();
    setIsFullScreen(true);
  };

  // Poistu koko näytöstä
  const exitFullscreen = () => {
    document.exitFullscreen();
    setIsFullScreen(false);
  };

  return { isFullScreen, enterFullscreen, exitFullscreen };
};

export default useFullScreen;
