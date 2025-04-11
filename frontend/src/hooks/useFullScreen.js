import { useEffect, useState, useCallback } from "react";

const useFullScreen = (isMobile, isLightBoxOpen) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullscreen = useCallback(() => {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      document.body.msRequestFullscreen();
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
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
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
