import { useEffect, useState, useCallback } from "react";

const useFullScreen = (isMobile: boolean, isLightBoxOpen: boolean) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullscreen = useCallback(() => {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    }
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo(0, 50);
      }, 100);
    }
    setIsFullScreen(true);
  }, [isMobile]);

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(false);
  };

  useEffect(() => {
    if (!isLightBoxOpen) {
      exitFullscreen();
    }
  }, [isLightBoxOpen]);

  return { isFullScreen, enterFullscreen, exitFullscreen };
};

export default useFullScreen;
