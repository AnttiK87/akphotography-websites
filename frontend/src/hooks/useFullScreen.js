import { useEffect, useState } from "react";

const useFullScreen = (isMobile) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      enterFullscreen();
    }
  }, [isMobile]);

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
